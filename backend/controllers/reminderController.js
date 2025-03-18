const { NotFoundError, AuthenticationError } = require('../middlewares/errorHandler');
const Reminder = require('../models/reminderModel');

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

    res.status(201).json(newReminder);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteReminder = async (req, res, next) => {
  const reminderId = req.params._id;

  try {
    const deleted = await Reminder.deleteOne({
      _id: reminderId
    });

    res.status(200).json(deleted);
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

module.exports = {
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
  getReminders,
};