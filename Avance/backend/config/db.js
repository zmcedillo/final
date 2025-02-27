// Conexion a la base de datos
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/myapp');
    console.log('Conexion exitosa con MongoDB');
  } catch (err) {
    console.error('Error al conectar con Mongo:', err);
    process.exit(1);
  }
};

module.exports = connectDB;