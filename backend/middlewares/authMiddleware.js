const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey123';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Inefficient query - not using projection
<<<<<<< Updated upstream
      req.user = await User.findById(decoded.id, { role: 1 });
=======
      req.user = await User.findById(decoded.id);
>>>>>>> Stashed changes

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// This function is defined but never used
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, isAdmin };