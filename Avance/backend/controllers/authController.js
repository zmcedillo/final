const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
//Recibe el usuario y contraseña, la encripta
const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    
    const user = await User.findOne({ username });
    console.log('Usuario encontrado:', username);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Contraseña ingresada:', password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    
    

    
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    res.json({ token, userId: user._id, role: user.role });
  } catch (err) {
    console.error('Error durante el inicio de sesión:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login };