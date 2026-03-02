const cron = require('node-cron');
const Todo = require('../models/Todo');
const User = require('../models/User');
const { sendStartDateReminder, sendDueDateReminder, sendOverdueReminder } = require('./emailService');

const startNotificationService = () => {
  // Se ejecuta cada hora
  cron.schedule('0 * * * *', async () => {
    console.log('🔔 Revisando notificaciones...');

    try {
      const now = new Date();

      // ── Notificaciones de inicio (48 horas antes) ──
      const in48hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      const todosStartingSoon = await Todo.find({
        startDate: { $gte: now, $lte: in48hours },
        completed: false,
        startNotificationSent: { $ne: true },
      });

      for (const todo of todosStartingSoon) {
        const user = await User.findById(todo.user);
        if (user && user.notificationsEmail) {
          await sendStartDateReminder(user, todo);
          await Todo.findByIdAndUpdate(todo._id, { startNotificationSent: true });
          console.log(`✅ Notificación de inicio enviada a ${user.email} para "${todo.title}"`);
        }
      }

      // ── Notificaciones de vencimiento (72 horas antes) ──
      const in72hours = new Date(now.getTime() + 72 * 60 * 60 * 1000);

      const todosDueSoon = await Todo.find({
        dueDate: { $gte: now, $lte: in72hours },
        completed: false,
        dueNotificationSent: { $ne: true },
      });

      for (const todo of todosDueSoon) {
        const user = await User.findById(todo.user);
        if (user && user.notificationsEmail) {
          await sendDueDateReminder(user, todo);
          await Todo.findByIdAndUpdate(todo._id, { dueNotificationSent: true });
          console.log(`✅ Notificación de vencimiento enviada a ${user.email} para "${todo.title}"`);
        }
      }

      // ── Notificaciones post-vencimiento (2 días después) ──
      const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      const todosOverdue = await Todo.find({
        dueDate: { $lte: twoDaysAgo },
        completed: false,
        overdueNotificationSent: { $ne: true },
      });

      for (const todo of todosOverdue) {
        const user = await User.findById(todo.user);
        if (user && user.notificationsEmail) {
          await sendOverdueReminder(user, todo);
          await Todo.findByIdAndUpdate(todo._id, { overdueNotificationSent: true });
          console.log(`✅ Notificación de vencida enviada a ${user.email} para "${todo.title}"`);
        }
      }

    } catch (error) {
      console.error('Error en el servicio de notificaciones:', error);
    }
  });

  console.log('🔔 Servicio de notificaciones iniciado ✅');
};

module.exports = { startNotificationService };