const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "super-admin"],
    default: "admin",
  },
  profilePic: { type: String },
  status: { type: String, enum: ["online", "offline"], default: "offline" },
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
  timestamps: true // Automatically adds createdAt and updatedAt fields
});


module.exports = mongoose.model('Admin', adminSchema);
