const express = require("express");
const {
  getNotifications,
  addNotification,
  replyToNotification,
  dashboardNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", getNotifications);
router.get("/dashboard", dashboardNotification);
router.post("/", addNotification);
router.put("/:id/reply", replyToNotification);

module.exports = router;
