const { NotFoundError, AuthenticationError } = require('../middlewares/errorHandler');
const Reminder = require('../models/reminderModel');
const User = require('../models/userModel');
const { sendEmail } = require('./emailController');
const { cancelTask, scheduleTask } = require('./scheduleController');
const ObjectId = require('mongoose').ObjectId;

// Get single reminder by ID
const getReminderById = async (req, res, next) => {
  if (!req.params.id) {
    return;
  }
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      throw new NotFoundError(`Reminder id '${req.params.id}' not found`);
    }

    res.json(reminder);
  } catch (error) {
    next(error);
  }
};

// Create a new reminder entry
const createReminder = async (req, res, next) => {
  const { activityName, time, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;

  try {

    const newReminder = await Reminder.create({
      user: req.user._id,
      activityName,
      time,
      weekDays: {
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      }
    });

    await setReminderNotifications(newReminder, next);

    res.status(201).json(newReminder);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update an reminder
const updateReminder = async (req, res, next) => {
  res.status(200);
  // const { reminder, intensity, notes } = req.body;

  // try {
  //   const reminderRecord = await Reminder.findById(req.params.id);

  //   if (!reminderRecord) {
  //     throw new NotFoundError('Reminder not found');
  //   }

  //   reminderRecord.reminder = reminder || reminderRecord.reminder;
  //   reminderRecord.intensity = intensity || reminderRecord.intensity;
  //   reminderRecord.notes = notes || reminderRecord.notes;

  //   const updatedReminder = await reminderRecord.save();
  //   res.json(updatedReminder);
  // } catch (error) {
  //   next(error);
  // }
};

// Get all reminders for a user
const getReminders = async (req, res, next) => {
  if (!req.user || !req.user._id) {
    throw new AuthenticationError('User needs to be authenticated');
  }
  const matchParams = { user: req.user._id };
  try {
    const reminders = await Reminder.find(matchParams);
    res.status(200).json(reminders);
  } catch (error) {
    next(error);
  }
};

const deleteReminder = async (req, res, next) => {
  const reminderId = req.params.id;

  try {
    const deleted = await Reminder.findOneAndDelete({ _id: reminderId })

    if (deleted) {
      await cancelTask(reminderId);
      res.status(200).json(deleted);

    } else {
      res.status(304).json({ message: 'Not deleted' });
    }

  } catch (error) {
    console.error(error);
    next(error);
  }
};

async function setReminderNotifications(doc, next) {
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

    console.log(doc.id, frequency, mailParams, user.timezone);

    await scheduleTask(doc.id, frequency, mailParams, user.timezone, async (data) => {
      console.log('sendEmail', data);
      await sendEmail(data.to, data.subject, data.htmlContent);
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
  getReminders,
  setReminderNotifications
};