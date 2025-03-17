const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey123';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

const updateUserProfile = async (req, res, next) => {
  const authUser = req.user._id;
  const { _id, name, email, oldPassword, newPassword } = req.body;
  if (authUser !== _id) {
    res.send(401).json({ message: 'You cannot update another user profile.' });
  }
  try {
    // Check if user already exists with that email
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.updateOne({ _id: _id }, {
      $set: {
        name,
        email
      }
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err) {
    next(err);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email });

    if (user && user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    next(err);
  }
};

// Get user profile
const getUserProfile = async (req, res, next) => {
  const userId = req.params.id
  if (!req.user || !req.user._id) {
    res.send(400).json({ message: 'Bad request. Missing user id' });
    return;
  }
  try {
    const user = await User.findById(req.user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err) {
    next(err);
  }
};

// TODO: Implement user update endpoint
// TODO: Implement password reset endpoint

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};