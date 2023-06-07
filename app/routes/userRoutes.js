const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');

// User Registration API
router.post('/register', registerUser);

// User Login API
router.post('/login', loginUser);

// Forgot Password API
router.post('/forgot-password', forgotPassword);

// Reset Password API
router.post('/reset-password', resetPassword);

module.exports = router;
