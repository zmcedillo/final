const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Modelo de la estructura de la base de datos users
const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ["admin", "user"], default: "user" }, 
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Referencia al producto
      quantity: { type: Number, default: 1 }, // Cantidad del producto en el carrito
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model('users', userSchema);
