const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: null, // opcional por ahora, obligatorio cuando agreguemos WhatsApp
  },
  notificationsEmail: {
    type: Boolean,
    default: true, // por defecto recibe notificaciones por email
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);