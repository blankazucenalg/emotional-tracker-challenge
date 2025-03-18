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

// reminderSchema.post('save', () => {
//   // TODO: Generate NotificationEvents for next months based on settings
// });


module.exports = mongoose.model('Reminder', reminderSchema);