const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// ✅ Super Admin Login
router.post("/login-super-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debugging logs
    console.log("Received email:", email);
    console.log("Received password:", password);

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // ✅ Find Super Admin in the database
    const superAdmin = await User.findOne({ email, role: "super-admin" });
    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found!" });
    }

    console.log("Stored hashed password in DB:", superAdmin.password);

    // ✅ Compare password correctly
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: superAdmin._id, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Super Admin Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Ensure Only One Super Admin Exists
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

    // ✅ Check if a super-admin already exists
    const existingSuperAdmin = await User.findOne({ role: "super-admin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "Super Admin already exists!" });
    }

    // ✅ Create the Super Admin with the role "super-admin"
    const superAdmin = new User({
      name,
      email,
      password, // Will be hashed inside User model before saving
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

// ✅ Fetch Super Admin details
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
