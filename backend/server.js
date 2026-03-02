
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const { startNotificationService } = require('./services/notificationService');

const app = express();

// Middlewares globales
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
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
  .catch((err) => console.log(err));