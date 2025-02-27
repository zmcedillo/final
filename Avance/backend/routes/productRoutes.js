const express = require('express');
const Product = require('../models/Product');
const jwt = require("jsonwebtoken");
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();


// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

// Añadir un producto
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, price, description, url, quantity } = req.body;
  try {
    const product = new Product({ name, price, description, url, quantity });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error al crear el producto:', err);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
});


// Actualizar el stock de un producto
router.patch('/:id/stock', async (req, res) => {
    const { quantityChange } = req.body;
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      product.quantity += quantityChange;
      await product.save();
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: 'Error al actualizar el stock' });
    }
  });

module.exports = router;