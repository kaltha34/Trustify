const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true }, // Associate notification with a user
    message: { type: String, required: true },
    reply: { type: String, default: null },
    isRead: { type: Boolean, default: false }, // Track if user has seen it
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
