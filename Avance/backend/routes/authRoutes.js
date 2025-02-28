const express = require('express');
const { login } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/login', login);

router.get("/role", authMiddleware, async (req, res) => {
  try {
    console.log("Petición a /api/users/role")
    const user = await User.findById(req.userId, "role");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el rol" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const newUser = new User({ username, password, role });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Añade un producto al carrito del usuario actual
router.post('/cart', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  try {
    console.log("Petición a /api/users/cart");
    const product = await Product.findById(productId);
    if (!product || product.quantity < 1) {
      return res.status(404).json({ message: 'Producto no disponible' });
    }

    const user = await User.findById(req.userId);
    const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (productIndex !== -1) {
      user.cart[productIndex].quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    product.quantity -= 1;
    await product.save();

    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error('Error al añadir al carrito:', err);
    res.status(500).json({ message: 'Error al añadir al carrito' });
  }
});

// Eliminar un producto del carrito del usuario actual
router.delete('/cart/:productId', authMiddleware, async (req, res) => {
  const { productId } = req.params;
  try {
    const user = await User.findById(req.userId);
    const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    // Aumenta el stock según la cantidad en el carrito
    const product = await Product.findById(productId);
    product.quantity += user.cart[productIndex].quantity; 
    await product.save();

    // Eliminar el producto del carrito
    user.cart.splice(productIndex, 1);
    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.error('Error al eliminar del carrito:', err);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
});

// Obtener el carrito de un usuario con detalles de los productos
router.get('/cart', authMiddleware, async (req, res) => {
  try {
    console.log("Petición a /api/users/cart");
    const user = await User.findById(req.userId).populate('cart.productId');
    res.json(user.cart);
  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
});

module.exports = router;