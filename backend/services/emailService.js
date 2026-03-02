const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendStartDateReminder = async (user, todo) => {
  const mailOptions = {
    from: `"Todo App" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: '🚀 Tu tarea está próxima a iniciar',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #4f46e5; padding: 20px; border-radius: 12px 12px 0 0;">
          <h2 style="color: white; margin: 0;">🚀 Recordatorio de inicio</h2>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 12px 12px;">
          <p>Hola <strong>${user.name}</strong>,</p>
          <p>Tu tarea <strong>"${todo.title}"</strong> está programada para iniciar en menos de <strong>48 horas</strong>.</p>
          <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #4f46e5; margin: 16px 0;">
            <p style="margin: 0;"><strong>Tarea:</strong> ${todo.title}</p>
            <p style="margin: 8px 0 0;"><strong>Fecha de inicio:</strong> ${new Date(todo.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            ${todo.dueDate ? `<p style="margin: 8px 0 0;"><strong>Fecha límite:</strong> ${new Date(todo.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>` : ''}
          </div>
          <p>¡No olvides prepararte! 💪</p>
          <p style="color: #888; font-size: 12px;">Este es un mensaje automático de Todo App.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendDueDateReminder = async (user, todo) => {
  const mailOptions = {
    from: `"Todo App" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: '⚠️ Tu tarea está próxima a vencer',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #e53e3e; padding: 20px; border-radius: 12px 12px 0 0;">
          <h2 style="color: white; margin: 0;">⚠️ Recordatorio de vencimiento</h2>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 12px 12px;">
          <p>Hola <strong>${user.name}</strong>,</p>
          <p>Tu tarea <strong>"${todo.title}"</strong> vence en menos de <strong>72 horas</strong>.</p>
          <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #e53e3e; margin: 16px 0;">
            <p style="margin: 0;"><strong>Tarea:</strong> ${todo.title}</p>
            <p style="margin: 8px 0 0;"><strong>Progreso actual:</strong> ${todo.progress}%</p>
            <p style="margin: 8px 0 0;"><strong>Fecha límite:</strong> ${new Date(todo.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <p>¡Date prisa y completa tu tarea! ⏰</p>
          <p style="color: #888; font-size: 12px;">Este es un mensaje automático de Todo App.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendOverdueReminder = async (user, todo) => {
  const mailOptions = {
    from: `"Todo App" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: '🚨 Tienes una tarea vencida que necesita atención',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #742a2a; padding: 20px; border-radius: 12px 12px 0 0;">
          <h2 style="color: white; margin: 0;">🚨 Tarea vencida</h2>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 12px 12px;">
          <p>Hola <strong>${user.name}</strong>,</p>
          <p>Tu tarea <strong>"${todo.title}"</strong> venció hace <strong>2 días</strong> y aún no ha sido completada.</p>
          <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #742a2a; margin: 16px 0;">
            <p style="margin: 0;"><strong>Tarea:</strong> ${todo.title}</p>
            <p style="margin: 8px 0 0;"><strong>Progreso actual:</strong> ${todo.progress}%</p>
            <p style="margin: 8px 0 0;"><strong>Fecha límite:</strong> ${new Date(todo.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <p>Por favor toma una de estas acciones:</p>
          <ul>
            <li>✅ <strong>Completar la tarea</strong> si ya la terminaste</li>
            <li>📅 <strong>Actualizar la fecha límite</strong> si necesitas más tiempo</li>
            <li>🗑️ <strong>Eliminar la tarea</strong> si ya no es necesaria</li>
          </ul>
          <p style="color: #888; font-size: 12px;">Este es un mensaje automático de Todo App.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendStartDateReminder, sendDueDateReminder, sendOverdueReminder };