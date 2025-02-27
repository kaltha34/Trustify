const express = require("express");
const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Fetch all regular users
router.get("/users/regular", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Fetch all admins
router.get("/admins", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
});
// Assign user as admin
router.post("/assignAdmin", async (req, res) => {
  try {
    const { email } = req.body;

    // if (!email) {
    //   return res.status(400).json({ message: "Email is required" });
    // }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "User is already an admin" });
    }

    const newAdmin = new Admin({
      name: user.name,
      email: user.email,
      password: user.password,
      role: "admin",
      createdAt: user.createdAt,
    });

    await newAdmin.save();

    const updatedAdmins = await Admin.find();
    res
      .status(200)
      .json({ message: "User assigned as admin successfully", updatedAdmins });
  } catch (error) {
    console.error("Error assigning admin:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Remove admin
router.post("/removeAdmin", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOneAndDelete({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await new User({
        name: admin.name,
        email: admin.email,
        password: admin.password,
        role: "user",
        createdAt: admin.createdAt,
      }).save();
    }

    const updatedAdmins = await Admin.find();
    res
      .status(200)
      .json({ message: "Admin removed successfully", updatedAdmins });
  } catch (error) {
    console.error("Error removing admin:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

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

//get super adimn details
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

router.post("/delete-super-admin", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if the user is the Super Admin
    const superAdmin = await User.findOne({ role: "super-admin", email });
    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found!" });
    }

    // Delete the Super Admin
    await User.findOneAndDelete({ email });

    res.status(200).json({ message: "Super Admin deleted successfully!" });
  } catch (error) {
    console.error("Error deleting Super Admin:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
module.exports = router;
