const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { generateOTP, sendEmail } = require('../utils/emailUtils');
const {
  validateEmail,
  validateMobile,
  validateStrongPassword,
} = require('../utils/regexUtils');

// User Registration API
const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if the user already exists with the email or mobile
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already registered' });
    }

    const existingUserMobile = await User.findOne({ mobile });
    if (existingUserMobile) {
      return res
        .status(400)
        .json({ success: false, message: 'Mobile number already registered' });
    }

    // Validate name
    if (!name || name.trim() === '') {
      return res
        .status(400)
        .json({ success: false, message: 'Name is required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email format' });
    }

    // Validate mobile format
    if (!validateMobile(mobile)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid mobile format' });
    }

    // Validate password
    if (!validateStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          'Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character',
      });
    }

    // Create a new user
    const user = new User({ name, email, mobile, password });
    await user.save();

    // Generate and send OTP to the user's email
    const otp = generateOTP();
    await sendEmail(email, 'OTP for Registration', `Your OTP is: ${otp}`);

    return res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// User Login API
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email format' });
    }

    // Validate password format
    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid password format' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });
    }

    // Validate password
    if (user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, 'secretKey', {
      expiresIn: '1h',
    });

    // Save the token to the user's document (optional)
    user.token = token;
    await user.save();

    // Return success response with token
    return res.json({
      success: true,
      message: 'User logged in successfully',
      token,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Forgot Password API
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email format' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save the OTP to the user's document (optional)
    user.resetOTP = otp;
    await user.save();

    // Send email with OTP
    const subject = 'Password Reset OTP';
    const text = `Your OTP for password reset is: ${otp}`;
    await sendEmail(email, subject, text);

    // Return success response
    return res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Reset Password API
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email format' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Verify OTP
    if (user.resetOTP !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    // Validate new password format
    if (!validateStrongPassword(newPassword)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid password format' });
    }

    // Update password
    user.password = newPassword;
    user.resetOTP = undefined; // Clear the OTP field
    await user.save();

    // Return success response
    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
