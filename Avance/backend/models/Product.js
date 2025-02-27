const mongoose = require('mongoose');
// Modelo de la estructura de la base de datos products
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);