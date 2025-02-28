import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [userRole, setUserRole] = useState(null);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
const BACKEND_URL = 'http://localhost:3000';

  useEffect(() => {
    if (!token || !userId) {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        const userIdFromUrl = urlParams.get('userId');
        const roleFromUrl = urlParams.get('role');
        if (tokenFromUrl && userIdFromUrl){
            localStorage.setItem('token', tokenFromUrl);
            localStorage.setItem('userId', userIdFromUrl);
            if (roleFromUrl) {
              localStorage.setItem('role', roleFromUrl);
              setUserRole(roleFromUrl);
            }
            loadProducts();
            
        } else {
          navigate('/login');
        }
      return;
    }

    loadProducts();
    loadCart();
    checkRole();
  }, []);

  // Función para añadir un producto al carrito
  const addToCart = async (productId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        loadProducts(); // Recarga los productos para actualizar el stock
        loadCart(); // Recarga el carrito
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al añadir al carrito');
      }
    } catch (err) {
      console.error('Error al añadir al carrito:', err);
      alert('Error de conexión. Inténtalo de nuevo.');
    }
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadProducts(); // Recargar productos para actualizar el stock
        loadCart(); // Recargar el carrito
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al eliminar del carrito');
      }
    } catch (err) {
      console.error('Error al eliminar del carrito:', err);
      alert('Error de conexión. Inténtalo de nuevo.');
    }
  };

  // Cargar productos desde la base de datos
  const loadProducts = async () => {
    console.log("Petición a /api/products desde loadProducts");
    const response = await fetch(`${BACKEND_URL}/api/products`);
    const productsData = await response.json();
    setProducts(productsData);
  };

  // Función para cargar el carrito
  const loadCart = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/cart`, {
        method: "GET",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el carrito');
      }

      const cartData = await response.json();
      setCart(cartData);
    } catch (err) {
      console.error('Error al cargar el carrito:', err);
      alert('Error al cargar el carrito. Inténtalo de nuevo.');
    }
  };

  const getUserRole = async () => {
    if (!token) return null;
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/role`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      return data.role; 
    } catch (error) {
      console.error("Error obteniendo el rol:", error);
      return null;
    }
  };

  const checkRole = async () => {
    const role = await getUserRole();
    setUserRole(role);
  };

  const handleAddProduct = async(e) => {
    e.preventDefault();
    const product = {
      name: document.getElementById('product-name').value,
      price: parseFloat(document.getElementById('product-price').value),
      description: document.getElementById('product-description').value,
      url: document.getElementById('product-url').value,
      quantity: parseInt(document.getElementById('product-quantity').value),
    };
    
    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`},
      body: JSON.stringify(product),
    });

    if (response.ok) {
      document.getElementById('add-product-modal').style.display = 'none';
      loadProducts(); // Recargar productos
    } else {
      alert('Error al añadir el producto');
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login'); // Redirige al login
  };

  return (
    <div>
      {/* Banner con nombre y logo */}
      <header className="banner">
        <img src="/Logo.png" alt="Logo" className="logo" />
        <h1>HardwareZone</h1>
        <button className="cart-icon" id="cart-icon" onClick={() => document.getElementById('cart-sidebar').classList.toggle('open')}>
          🛒
          <span className="cart-count" id="cart-count">{cart.length}</span>
        </button>
        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button> {/* Logout button */}
      </header>
      <div className="cart-sidebar" id="cart-sidebar">
        <h2>Carrito de Compras</h2>
        <div id="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.productId._id}>
              <img src={item.productId.url} alt={item.productId.name} />
              <span>{item.productId.name} (x{item.quantity})</span>
              <button onClick={() => removeFromCart(item.productId._id)}>Eliminar</button>
            </div>
          ))}
        </div>
        <button id="close-cart" onClick={() => document.getElementById('cart-sidebar').classList.remove('open')}>Cerrar</button>
      </div>

      <section className="products">
        <h2>Productos Disponibles</h2>
        <div id="product-list" className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.url} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Precio: {product.price}</p>
              <p>Stock: {product.quantity}</p>
              <button disabled={product.quantity === 0} onClick={() => addToCart(product._id)}>
                {product.quantity === 0 ? 'No hay Stock' : 'Comprar'}
              </button>
            </div>
          ))}
        </div>
      </section>
        <button id="add-product-btn" style={{ display: userRole === 'admin' ? 'block' : 'none' }} className="add-product-btn" onClick={()=>document.getElementById('add-product-modal').style.display = 'flex'}>Añadir Producto</button>
        <div id="add-product-modal" className="modal">
        <div className="modal-content">
          <button className="close" onClick={()=>document.getElementById('add-product-modal').style.display = 'none'}>×</button>
          <h2>Añadir Producto</h2>
          <form id="add-product-form" onSubmit={handleAddProduct}>
            <input type="text" id="product-name" placeholder="Nombre" required />
            <input type="number" id="product-price" placeholder="Precio" required />
            <input type="text" id="product-description" placeholder="Descripción" required />
            <input type="text" id="product-url" placeholder="URL de la imagen" required />
            <input type="number" id="product-quantity" placeholder="Cantidad" required />
            <button type="submit">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
