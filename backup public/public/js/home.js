document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const addProductBtn = document.getElementById('add-product-btn');
  const addProductModal = document.getElementById('add-product-modal');
  const closeModal = document.querySelector('.close');
  const addProductForm = document.getElementById('add-product-form');
  const cartIcon = document.getElementById('cart-icon');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartItems = document.getElementById('cart-items');
  const closeCartBtn = document.getElementById('close-cart');
  const cartCount = document.getElementById('cart-count');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('userRole');

  if (!token || !userId) {
    window.location.href = '/login.html'; // Redirigir al login si no hay token o userId
  }

  // Cargar productos y carrito al iniciar
  loadProducts();
  loadCart();

  // Mostrar modal para añadir productos
  addProductBtn.addEventListener('click', () => {
    addProductModal.style.display = 'flex';
  });

  // Cerrar modal
  closeModal.addEventListener('click', () => {
    addProductModal.style.display = 'none';
  });

  // Añadir producto
  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const product = {
      name: document.getElementById('product-name').value,
      price: parseFloat(document.getElementById('product-price').value),
      description: document.getElementById('product-description').value,
      url: document.getElementById('product-url').value,
      quantity: parseInt(document.getElementById('product-quantity').value),
    };
    
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`},
      body: JSON.stringify(product),
    });

    if (response.ok) {
      addProductModal.style.display = 'none';
      loadProducts(); // Recargar productos
    } else {
      alert('Error al añadir el producto');
    }
  });

  // Abrir/cerrar el carrito
  cartIcon.addEventListener('click', () => {
    cartSidebar.classList.toggle('open');
  });

  closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
  });
// Conseguir rol del usuario loggeado
  async function getUserRole() {
    if (!token) return null;
  
    try {
      const response = await fetch("/api/users/role", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      
      return data.role; // Retorna el rol (ejemplo: "admin" o "user")
    } catch (error) {
      console.error("Error obteniendo el rol:", error);
      return null;
    }
  }

  async function checkRole() {
    const role = await getUserRole();
    alert("Role: " + role);
    if (role !== "admin") {
      addProductBtn.style.display = 'none'; // Ocultar botón si no es admin
    } else {
      addProductBtn.style.display = 'block'; // Mostrar botón si es admin
    }
  }

  checkRole();

// Función para añadir un producto al carrito
async function addToCart(productId) {
  try {
    const response = await fetch(`/api/users/cart`, {
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
}

// Función para eliminar un producto del carrito
async function removeFromCart(productId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/users/cart/${productId}`, {
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
}

// Hacer la función accesible globalmente
window.removeFromCart = removeFromCart;

  // Cargar productos desde la base de datos
  async function loadProducts() {
    const response = await fetch('/api/products');
    const products = await response.json();
    productList.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.url}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.quantity}</p>
        <button ${product.quantity === 0 ? 'disabled' : ''} onclick="addToCart('${product._id}')">
          ${product.quantity === 0 ? 'No hay Stock' : 'Comprar'}
        </button>
      </div>
    `).join('');
  }

// Función para cargar el carrito
async function loadCart() {
  try {
    const response = await fetch(`/api/users/cart`, {
      headers: { Authorization: `Bearer ${token}` }, 
    });

    if (!response.ok) {
      throw new Error('Error al obtener el carrito');
    }

    const cart = await response.json();
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.productId.url}" alt="${item.productId.name}">
        <span>${item.productId.name} (x${item.quantity})</span>
        <button onclick="removeFromCart('${item.productId._id}')">Eliminar</button>
      </div>
    `).join('');
    cartCount.textContent = cart.length;
  } catch (err) {
    console.error('Error al cargar el carrito:', err);
    alert('Error al cargar el carrito. Inténtalo de nuevo.');
  }
}

  // Hacer las funciones accesibles globalmente
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
});