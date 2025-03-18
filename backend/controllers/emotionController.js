const { NotFoundError, AuthenticationError } = require('../middlewares/errorHandler');
const Emotion = require('../models/emotionModel');

// Get single emotion by ID
const getEmotionById = async (req, res, next) => {
  if (!req.params.id) {
    return;
  }
  try {
    const emotion = await Emotion.findById(req.params.id);

    if (!emotion) {
      throw new NotFoundError(`Emotion id '${req.params.id}' not found`);
    }

    res.json(emotion);
  } catch (error) {
    next(error);
  }
};

// Create a new emotion entry
const createEmotion = async (req, res, next) => {
  const { emotion, intensity, notes } = req.body;

  try {

    const newEmotion = await Emotion.create({
      user: req.user._id,
      emotion,
      intensity,
      notes
    });

    res.status(201).json(newEmotion);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update an emotion
const updateEmotion = async (req, res, next) => {
  const { emotion, intensity, notes } = req.body;

  try {
    const emotionRecord = await Emotion.findById(req.params.id);

    if (!emotionRecord) {
      throw new NotFoundError('Emotion not found');
    }

    emotionRecord.emotion = emotion || emotionRecord.emotion;
    emotionRecord.intensity = intensity || emotionRecord.intensity;
    emotionRecord.notes = notes || emotionRecord.notes;

    const updatedEmotion = await emotionRecord.save();
    res.json(updatedEmotion);
  } catch (error) {
    next(error);
  }
};

// Get all emotions for a user
const getEmotions = async (req, res, next) => {
  if (!req.user || !req.user._id) {
    throw new AuthenticationError('User needs to be authenticated');
  }
  const matchParams = { user: req.user._id };
  try {
    const emotions = await Emotion.find(matchParams);
    res.status(200).json(emotions);
  } catch (error) {
    next(error);
  }
};

const getEmotionsSummary = async (req, res, next) => {
  const userId = req.user._id;
  try {
    if (!userId) {
      throw new AuthenticationError('User needs to be authenticated');
    }
    const emotions = await Emotion.aggregate([
      {
        $match: {
          user: userId
        }
      },
      { $sort: { date: 1 } },
      {
        $group: {
          _id: "$emotion",
          emotion: { $first: '$emotion' },
          count: { $sum: 1 },
          averageIntensity: { $avg: "$intensity" },
          lastDate: { $last: '$date' },
        }
      }
    ]);

    res.json(emotions);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEmotionById,
  createEmotion,
  updateEmotion,
  getEmotions,
  getEmotionsSummary
};