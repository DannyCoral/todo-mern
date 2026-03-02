const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'inProgress', 'completed'],
    default: 'pending',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
   startDate: {
    type: Date,
    default: null, // 👈 fecha de inicio opcional
  },
  dueDate: {
    type: Date,
    default: null,
  },

  startNotificationSent: {
    type: Boolean,
    default: false, // 👈 evita enviar la notificación dos veces
  },
  dueNotificationSent: {
    type: Boolean,
    default: false, // 👈 evita enviar la notificación dos veces
  },
  overdueNotificationSent: {
  type: Boolean,
  default: false,
},
  notes: [noteSchema],
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);