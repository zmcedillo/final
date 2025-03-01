const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
require('dotenv').config();
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000; // Se cambia el puerto a 3000 para evitar confusiones

connectDB();

app.use(cors());
app.use(express.json());

app.use(session({
  secret: "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",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', authRoutes);

// Sirve los archivos estáticos desde la carpeta 'public' que está un nivel arriba
app.use(express.static(path.join(__dirname, '../public/dist')));

// Ruta para todas las peticiones, para que react pueda manejar las rutas
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dist', 'index.html'));
  });


app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
