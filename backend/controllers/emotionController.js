const Emotion = require('../models/emotionModel');

<<<<<<< Updated upstream
// Get all emotions for a user
const getEmotions = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authorized' });
  }
  const matchParams = { user: req.user._id };
  if (req.params.last30days === 'true') {
    const today = new Date();
    const last30days = subDays(today, 30);
    matchParams.date = { $gte: last30days, $lte: today };
  }
  const emotions = await Emotion.find(matchParams);
  res.json(emotions);
};

// Get single emotion by ID
const getEmotionById = async (req, res) => {
  const emotion = await Emotion.findById(req.params.id);

  if (!emotion) {
    res.status(404).json({ message: 'Emotion not found' });
=======
// Get single emotion by ID
const getEmotionById = async (req, res, next) => {
  if (!req.params.id) {
>>>>>>> Stashed changes
    return;
  }
  try {
    const emotion = await Emotion.findById(req.params.id);

    if (!emotion) {
      res.status(404).json({ message: 'Emotion not found' });
      return;
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
      res.status(404).json({ message: 'Emotion not found' });
      return;
    }

    emotionRecord.emotion = emotion || emotionRecord.emotion;
    emotionRecord.intensity = intensity || emotionRecord.intensity;
    emotionRecord.notes = notes || emotionRecord.notes;

    const updatedEmotion = await emotionRecord.save();
    res.json(updatedEmotion);
  } catch (error) {
    next(error);
  }
<<<<<<< Updated upstream

  emotionRecord.emotion = emotion || emotionRecord.emotion;
  emotionRecord.intensity = intensity || emotionRecord.intensity;
  emotionRecord.notes = notes || emotionRecord.notes;

  const updatedEmotion = await emotionRecord.save();
  res.json(updatedEmotion);
};

const getEmotionsSummary = async (userId) => {
  if (!userId) {
    return;
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

  return emotions;

  // Inefficient query
  // const emotions = await Emotion.find({ user: userId });

  // // TODO: Implement aggregation for better performance
  // const summary = {
  //   count: emotions.length,
  //   averageIntensity: 0,
  //   emotionCounts: {}
  // };

  // emotions.forEach(e => {
  //   summary.averageIntensity += e.intensity;
  //   summary.emotionCounts[e.emotion] = (summary.emotionCounts[e.emotion] || 0) + 1;
  // });

  // if (emotions.length > 0) {
  //   summary.averageIntensity /= emotions.length;
  // }

  // return summary;
=======
};

// Get all emotions for a user
const getEmotions = async (req, res, next) => {
  if (!req.user || !req.user._id) {
    res.status(401).json({ message: 'Not authorized' });
  }
  const matchParams = { user: req.user._id };
  try {
    const emotions = await Emotion.find(matchParams);
    res.json(emotions);
  } catch (error) {
    next(error);
  }
};

const getEmotionsSummary = async (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    res.status(400).json({ message: 'Bad request. User id not found.' });
    return;
  }
  try {
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
>>>>>>> Stashed changes
};

module.exports = {
  getEmotionById,
  createEmotion,
  updateEmotion,
<<<<<<< Updated upstream
=======
  getEmotions,
>>>>>>> Stashed changes
  getEmotionsSummary
};