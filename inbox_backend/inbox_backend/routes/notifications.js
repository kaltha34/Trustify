const express = require("express");
const { getNotifications, addNotification, replyToNotification } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", getNotifications);
router.post("/", addNotification);
router.put("/:id/reply", replyToNotification);

module.exports = router;

