const mongoose = require('mongoose');

const emailCredentialsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }, // Use encrypted storage if possible
});

const EmailCredentials = mongoose.model('EmailCredentials', emailCredentialsSchema);
module.exports = EmailCredentials;
