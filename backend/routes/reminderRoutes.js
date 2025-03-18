const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getReminders, createReminder, getReminderById, deleteReminder } = require('../controllers/reminderController');

const router = express.Router();

// Protected routes
router.route('/')
  .get(protect, getReminders)
  .post(protect, createReminder);

router.route('/:id')
  .get(protect, getReminderById)
  .delete(protect, deleteReminder);



module.exports = router;