const { AuthorizationError, BadRequestError, NotFoundError, AuthenticationError } = require('../middlewares/errorHandler');
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
  const { _id, name, email, phone, timezone } = req.body;

  try {
    if (authUser.toString() !== _id) {
      throw new AuthorizationError('You cannot update another user profile.');
    }
    const user = await User.findById(_id);
    if (email) {
      if (user.email !== email) {
        // Email changed
        // Check if user already exists with that email
        const userWithNewEmailExists = await User.findOne({ email }, { _id: 1 });
        if (userWithNewEmailExists) {
          throw new BadRequestError('An user with the same email was already registered');
        }
      }
      user.email = email;
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.timezone = timezone || user.timezone;

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (err) {
    next(err);
  }
};

const updateUserPassword = async (req, res, next) => {
  const authUser = req.user._id;
  const { _id, oldPassword, newPassword } = req.body;

  try {
    if (authUser.toString() !== _id) {
      throw new AuthorizationError('You cannot update another user password.')
    }

    if (!oldPassword || !newPassword || oldPassword === newPassword) {
      throw new BadRequestError('Old and new passwords must be set and should not be the same.')
    }

    const user = await User.findById(_id);

    if (!user.matchPassword(oldPassword)) {
      throw new AuthenticationError('Invalid password');
    }
    user.password = newPassword;
    await user.save(); // pre-saving should process the passsword using bcrypt

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email }, { name: 1, email: 1, password: 1 });

    if (!user) {
      throw new NotFoundError(`User with email '${email}' was not found.`);
    }
    if (!user.matchPassword(password)) {
      throw new AuthenticationError('Invalid password');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    next(err);
  }
};

// Get user profile
const getUserProfile = async (req, res, next) => {
  const userId = req.user._id; // Authenticated user

  try {
    if (!userId) {
      throw new BadRequestError('User id needs to be specified');
    }
    const user = await User.findById(userId);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      timezone: user.timezone,
    });
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  const { name, email, password, timezone } = req.body;

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
      password,
      timezone
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

// TODO: Implement password reset endpoint

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword
};