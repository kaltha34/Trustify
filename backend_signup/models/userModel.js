const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // Default role is 'user'
  otp: {
    type: String, // OTP will be stored as a string (e.g., '123456')
    required: false,
    default: null
  },
  otpTimestamp: {
    type: Number, // Timestamp of OTP generation
    required: false,
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields// Default role is 'user'


});

module.exports = mongoose.model('User', userSchema);
