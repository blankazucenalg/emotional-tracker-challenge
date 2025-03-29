const { NotFoundError, AuthenticationError, BadRequestError } = require('../middlewares/errorHandler');
const Emotion = require('../models/emotionModel');
const validator = require('validator');

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
    const emotions = await Emotion.find(matchParams).sort({ date: -1 });
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
    if (req.query.dateStart && !validator.isDate(req.query.dateStart)) {
      throw new BadRequestError('dateStart is not a valid date');
    }
    if (req.query.dateEnd && !validator.isDate(req.query.dateEnd)) {
      throw new BadRequestError('dateEnd is not a valid date');
    }

    const matchParams = {
      user: userId,
    }
    if (req.query.dateStart && req.query.dateEnd) {
      const dateStart = new Date(req.query.dateStart);
      const dateEnd = new Date(req.query.dateEnd);

      if (dateEnd < dateStart) {
        throw new BadRequestError('dateStart must be before than dateEnd');
      }
      matchParams['$expr'] = {
        $and: [
          { $gte: ['$date', dateStart] },
          { $lte: ['$date', dateEnd] }
        ]
      }
    }
    const emotions = await Emotion.aggregate([
      {
        $match: matchParams
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

const getEmotionsHighlights = async (req, res, next) => {
  const userId = req.user._id;
  try {
    if (req.query.dateStart && !validator.isDate(req.query.dateStart)) {
      throw new BadRequestError('dateStart is not a valid date');
    }
    if (req.query.dateEnd && !validator.isDate(req.query.dateEnd)) {
      throw new BadRequestError('dateEnd is not a valid date');
    }

    const matchParams = {
      user: userId,
    };
    if (req.query.dateStart && req.query.dateEnd) {
      const dateStart = new Date(req.query.dateStart);
      const dateEnd = new Date(req.query.dateEnd);
      if (dateEnd < dateStart) {
        throw new BadRequestError('dateStart must be before than dateEnd');
      }
      matchParams['$expr'] = {
        $and: [
          { $gte: ['$date', dateStart] },
          { $lte: ['$date', dateEnd] }
        ]
      };
    }

    const emotions = await Emotion.aggregate([
      {
        $match: matchParams
      },
      {
        $group: {
          _id: '$emotion',
          emotion: { $first: '$emotion' },
          averageIntensity: { $avg: '$intensity' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          emotions: { $push: '$$ROOT' }
        }
      },
      { $unwind: { path: '$emotions' } },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ percentage: { $multiply: [{ $divide: ['$emotions.count', '$total'] }, 100] } }, '$emotions'] } } },
      {
        $sort: {
          count: -1,
          averageIntensity: -1
        }
      }
    ]);

    res.json(emotions);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEmotionById,
  createEmotion,
  updateEmotion,
  getEmotions,
  getEmotionsSummary,
  getEmotionsHighlights
};