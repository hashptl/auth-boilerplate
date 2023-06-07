/***
 * Regular expression
 */

// Regular expression for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Regular expression for mobile number validation
const mobileRegex = /^[0-9]{10}$/;

// Regular expression for strong password validation
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validate email format
const validateEmail = (email) => {
  return emailRegex.test(email);
};

// Validate mobile format
const validateMobile = (mobile) => {
  return mobileRegex.test(mobile);
};

// Validate strong password format
const validateStrongPassword = (password) => {
  return passwordRegex.test(password);
};

module.exports = {
  validateEmail,
  validateMobile,
  validateStrongPassword,
};
