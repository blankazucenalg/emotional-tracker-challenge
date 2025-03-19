const User = require('../models/userModel');

async function transformReminder(doc) {
  try {
    const user = await User.findById(doc.user, { email: 1, timezone: 1 });
    // Generate cron-like pattern for job scheduler
    const WEEK_DAYS = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    };
    const [hour, minute] = doc.time.split(':');
    const entries = Object.entries(doc.weekDays);
    const daysOfWeek = entries.reduce((prev, next) => {
      const [key, value] = next;
      let append = '';
      if (value) {
        append = WEEK_DAYS[key]
      }
      if (WEEK_DAYS[key] !== 0) {
        append += ','
      }
      return prev + append;
    }, '');

    const frequency = `${minute} ${hour} * * ${daysOfWeek}`;

    const mailParams = {
      to: user.email,
      subject: `Emotional Tracker - Recordatorio: ${doc.activityName}`,
      htmlContent: `<h1>Emotional Tracker - Recordatorio</h1>
          <p>Hola ${user.name}, este es tu recordatorio configurado para "${doc.activityName}" a las ${doc.time} horas.</p>
          <p>Sigue realizando actividades que contribuyan a tu bienestar mental y físico.</p>
          <p>Con cariño, el equipo de Emotional Tracker</p>`
    };

    return {
      name: `reminder email ${doc.id}`,
      frequency,
      data: mailParams,
      timezone: user.timezone
    };
  } catch (err) {
    throw new Error(`Unexpected Error: ${err.message}`);
  }
}

module.exports = {
  transformReminder
};