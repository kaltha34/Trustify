const Notification = require("../models/Notification");

// Get all notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// Add new notification
exports.addNotification = async (req, res, next) => {
  try {
    const { message } = req.body;
    const notification = new Notification({ message });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

// Reply to a notification
exports.replyToNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const notification = await Notification.findByIdAndUpdate(id, { reply }, { new: true });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
};
