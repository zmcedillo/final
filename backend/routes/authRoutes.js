const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { login } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.use(session({
  secret: "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",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
router.use(passport.initialize());
router.use(passport.session());

// Passport Configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Use environment variables
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Use environment variables
  callbackURL: "/api/auth/google/callback",
  scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user exists in your database
    let user = await User.findOne({ googleId: profile.id });
    console.log("despues de user findone");

    if (!user) {
      // Create a new user
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        role: "user",
      });
    console.log("despues de if user");
    await user.save();
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("token: ", token);
    user.token = token;
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
));

passport.serializeUser((user, done) => {
done(null, user.id); // Use user.id, not user._id
});

passport.deserializeUser(async (id, done) => {
try {
  const user = await User.findById(id);
  done(null, user);
} catch (err) {
  done(err, null);
}
});

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',

passport.authenticate('google', { failureRedirect: '/login' }),
(req, res) => {
  // Successful authentication, generate a JWT and send it to the frontend
  console.log('User from Google callback:', req.user);
  res.redirect(`https://final-frontend-jahn.onrender.com/home?token=${req.user.token}&userId=${req.user._id}&role=${req.user.role}`);
}
);









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
router.post('/cart/:userId', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  const userId = req.params.userId;
  try {
    console.log("Petición a /api/users/cart");
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const product = await Product.findById(productId);
    if (!product || product.quantity < 1) {
      return res.status(404).json({ message: 'Producto no disponible' });
    }

    const productIndex = user.cart.findIndex(item => item.productId.equals(productId));

    if (productIndex !== -1) {
      user.cart[productIndex].quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    product.quantity -= 1;
    await product.save();

    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    console.error('Error al añadir al carrito:', err);
    res.status(500).json({ message: 'Error al añadir al carrito' });
  }
});

// Eliminar un producto del carrito del usuario actual
router.delete('/cart/:userId', authMiddleware, async (req, res) => {
  const userId = req.params.userId;
  const { productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
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
router.get('/cart/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Petición a /api/users/cart");
    const user = await User.findById(userId).populate('cart.productId');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const populatedCart = await Promise.all(
      user.cart.map(async (cartItem) => {
        const product = await Product.findById(cartItem.productId);

        if (!product) {
          return null; //Producto no encontrado, devolver null
        }

        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          description: product.description,
          url: product.url,
          quantity: cartItem.quantity,
        };
      })
    );
    const filteredCart = populatedCart.filter((item) => item !== null);
    res.status(200).json(filteredCart);
  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
});

router.put('/cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    // Buscar al usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Encontrar el producto en el carrito
    const cartItem = user.cart.find(item => item.productId.equals(productId));
    const product = await Product.findById(productId);
    const quantityDifference = quantity - cartItem.quantity;
    console.log("b",quantityDifference);
    product.quantity -= quantityDifference;

    if(product.quantity < 0){
      return res.status(400).json({ message: "No hay suficiente stock" });
    }

    if(!cartItem){
      return res.status(404).json({message: "Producto no encontrado en el carrito"});
    }

    // Actualizar la cantidad
    cartItem.quantity = quantity;

    // Si la cantidad es 0, eliminar el producto
    if(quantity === 0){
      user.cart = user.cart.filter(item => !item.productId.equals(productId));
    }

    // Guardar los cambios
    await user.save();
    await product.save();
    res.status(200).json(user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto del carrito' });
  }
});

router.post('/create-checkout-session/:userId', authMiddleware, async (req, res) => {
  const userId = req.params.userId;
  const { cartItems } = req.body; // Recibe los productos del carrito
  const user = await User.findById(userId);
  console.log("user cart = ", user.cart);
  console.log("cartItems = ", cartItems);
  try {
    // Buscar al usuario
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el carrito está vacío
    
    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description
        },
        unit_amount: item.price * 100, // Precio en centavos
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `https://final-frontend-jahn.onrender.com/success?session_id={CHECKOUT_SESSION_ID}`, // Define la URL de éxito
      cancel_url: `https://final-frontend-jahn.onrender.com/cancel`, // Define la URL de cancelación
      metadata: {
        userId: userId // Agrega el ID del usuario a los metadatos
      }
    });

    res.json({ url: session.url }); // Retorna la URL de Stripe
  } catch (error) {
    console.error('Error al crear la sesión de pago:', error);
    res.status(500).json({ message: 'Error al crear la sesión de pago' });
  }
});

router.get('/check-payment-status/:sessionId', authMiddleware, async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Sesión de pago:', session);

    if (session.payment_status === 'paid') {
      const userId = session.metadata.userId; // Obtener el userId de los metadatos
      console.log('Pago exitoso para el usuario:', userId);

      // Buscar al usuario
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Vaciar el carrito del usuario
      console.log("cart antes del supuesto vaciado: ", user.cart);
      user.cart = [];
      console.log("cart despues del supuesto vaciado: ", user.cart);
      await user.save();

      res.json({ status: 'paid', message: 'Pago exitoso y carrito vaciado' });
    } else {
      res.json({ status: 'unpaid', message: 'Pago no completado' });
    }
  } catch (error) {
    console.error('Error al verificar el estado del pago:', error);
    res.status(500).json({ message: 'Error al verificar el estado del pago' });
  }
});

module.exports = router;