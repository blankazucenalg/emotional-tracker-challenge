const express = require('express');
const {
  getEmotions,
  getEmotionById,
  createEmotion,
  updateEmotion,
  getEmotionsSummary
} = require('../controllers/emotionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected routes
router.route('/')
  .get(protect, getEmotions)
  .post(protect, createEmotion);

<<<<<<< Updated upstream
router.get('/:id', protect, getEmotionById);
=======
router.route('/:id')
  .get(protect, getEmotionById)
  .put(protect, updateEmotion);
>>>>>>> Stashed changes

router.get('/analytics/summary', protect, getEmotionsSummary);

router.route('/analytics/summary')
  .get(protect, getEmotionsSummary);

// TODO: Add route for getting emotion summary
// TODO: Add route for sharing data with therapists

module.exports = router;