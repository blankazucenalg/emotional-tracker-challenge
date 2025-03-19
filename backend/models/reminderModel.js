const mongoose = require('mongoose');
const validator = require('validator');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  activityName: {
    type: String,
    enum: [
      'Seguimiento de emoción',
      'Actividad física',
      'Diario de gratitud',
      'Práctica de mindfulness',
      'Recordatorio de acto solidario',
      'Tiempo con tu mascota',
      'Contacto con la naturaleza',
      'Actividad para romper la monotonía',
      'Práctica de yoga',
      'Hora de dormir',
      'Tiempo de socializar'
    ],
    required: true
  },
  weekDays: {
    monday: { type: Boolean },
    tuesday: { type: Boolean },
    wednesday: { type: Boolean },
    thursday: { type: Boolean },
    friday: { type: Boolean },
    saturday: { type: Boolean },
    sunday: { type: Boolean }
  },
  time: {
    type: String,
    required: true,
    validate: [validator.isTime, 'Fill a valid time'],
  }
});

reminderSchema.index({ user: 1, activityName: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Reminder', reminderSchema);
