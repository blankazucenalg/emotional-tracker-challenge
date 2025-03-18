const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, updateUserPassword } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.put('/updatePassword', protect, updateUserPassword);

// TODO: Add routes for updating user profile and resetting password

module.exports = router;