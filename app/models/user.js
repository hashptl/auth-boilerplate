const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  resetOTP: {
    type: String
  },
  token: {
    type: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
