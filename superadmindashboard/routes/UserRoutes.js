const express = require("express");
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Ensure Only One Super Admin Exists
router.post("/create-super-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if a user already exists with the same email (for general users)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists!" });
    }

    // Check if a super-admin already exists
    const existingSuperAdmin = await User.findOne({ role: "super-admin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "Super Admin already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the Super Admin with the role "super-admin"
    const superAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "super-admin",
    });

    await superAdmin.save();
    res
      .status(201)
      .json({ message: "Super Admin created successfully!", superAdmin });
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch Super Admin details
router.get("/super-admin", async (req, res) => {
  try {
    const superAdmin = await User.findOne({ role: "super-admin" });

    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    res.status(200).json(superAdmin);
  } catch (error) {
    console.error("Error fetching Super Admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
