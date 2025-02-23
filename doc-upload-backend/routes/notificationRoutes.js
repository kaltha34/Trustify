const express = require("express");
const Notification = require("../model/notificationModel"); // Adjust path accordingly
const router = express.Router();

// Get the latest 3 notifications
router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ _id: -1 }).limit(5);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
});

module.exports = router;
