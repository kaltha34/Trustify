const express = require("express");
const Notification = require("../model/notificationModel");
const router = express.Router();

router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ _id: -1 }).limit(4);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
});

module.exports = router;
