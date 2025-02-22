const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  status: { type: String, enum: ['approved', 'blocked'], default: 'approved' }
});

module.exports = mongoose.model('User', userSchema);
