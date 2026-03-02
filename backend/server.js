
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const { startNotificationService } = require('./services/notificationService');

const app = express();

// Middlewares globales
app.use(cors({ 
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Sesión requerida por Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Passport
app.use(passport.initialize());

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

 process.on('uncaughtException', (err) => {
    console.error('uncaughtException:', err);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('unhandledRejection:', reason);
  });
  app.get('/', (req, res) => {
      res.json({ status: 'ok', message: 'API corriendo ✅' });
    });
// Conexión a MongoDB y arranque del servidor
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado ✅');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Servidor corriendo en puerto ${process.env.PORT || 5000} 🚀`);
      startNotificationService(); // 👈 iniciamos el servicio de notificaciones
    });
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1);
  });