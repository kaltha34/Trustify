const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model

// Fetch all users from MongoDB
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Get all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// Fetch a specific user by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

// Approve (Unblock) a user
router.put('/approve/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { status: "approved" }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User approved", user });
  } catch (err) {
    res.status(500).json({ message: "Error approving user", error: err.message });
  }
});

// Block a user
router.put('/block/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { status: "blocked" }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User blocked", user });
  } catch (err) {
    res.status(500).json({ message: "Error blocking user", error: err.message });
  }
});

module.exports = router;
