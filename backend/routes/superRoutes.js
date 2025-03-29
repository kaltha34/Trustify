const express = require("express");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const sendOTP = require("../utils/sendLoginOTP");

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    const admins = await Admin.find().sort({ createdAt: -1 });

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

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

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
      password: user.password, // Keeping hashed password
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

    // Restore as a regular user if not already present
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

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// router.post("/login-super-admin", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required!" });
//     }

//     // Find Super Admin in the database
//     const superAdmin = await Admin.findOne({ email, role: "super-admin" });
//     if (!superAdmin) {
//       return res.status(404).json({ message: "Super Admin not found!" });
//     }

//     // Compare password correctly
//     const isMatch = await bcrypt.compare(password, superAdmin.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials!" });
//     }

//     // Generate OTP
//     const otp = generateOTP();
//     superAdmin.otp = otp;
//     superAdmin.otpTimestamp = Date.now();
//     await superAdmin.save();

//     // Log the document to verify OTP is saved
//     console.log("Super Admin after OTP save:", superAdmin); // Debugging log to verify OTP saving

//     // Send OTP
//     await sendOTP(superAdmin, otp);

//     const token = jwt.sign(
//       { id: superAdmin._id, role: superAdmin.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res
//       .status(200)
//       .json({ message: "OTP sent to email", token, userId: superAdmin._id });
//   } catch (error) {
//     console.error("Super Admin Login Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/login-super-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Find Super Admin in the database
    const superAdmin = await Admin.findOne({ email, role: "super-admin" });
    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found!" });
    }

    // Debugging logs
    console.log("Entered Password:", password);
    console.log("Stored Hash:", superAdmin.password);

    // Ensure superAdmin.password is valid
    if (!superAdmin.password || typeof superAdmin.password !== "string") {
      return res
        .status(500)
        .json({ message: "Invalid stored password format" });
    }

    // Compare password correctly
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate OTP
    const otp = generateOTP();
    superAdmin.otp = otp;
    superAdmin.otpTimestamp = Date.now();
    await superAdmin.save();

    console.log("Super Admin after OTP save:", superAdmin); // Debugging log to verify OTP saving

    // Send OTP
    await sendOTP(superAdmin, otp);

    const token = jwt.sign(
      { id: superAdmin._id, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "OTP sent to email", token, userId: superAdmin._id });
  } catch (error) {
    console.error("Super Admin Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-otp-super-admin", async (req, res) => {
  try {
    const { otpInput, token } = req.body;

    if (!otpInput || !token) {
      return res.status(400).json({ message: "OTP and token are required!" });
    }

    // Decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token!" });
    }

    // Find Super Admin by ID from token
    const superAdmin = await Admin.findById(decoded.id);
    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found!" });
    }

    console.log("Super Admin record for OTP verification:", superAdmin); // Debugging log to verify OTP availability

    if (!superAdmin.otp) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new OTP." });
    }

    // Check OTP expiration (5 min)
    const otpExpirationTime = 5 * 60 * 1000;
    const otpAge = Date.now() - superAdmin.otpTimestamp;

    if (otpAge > otpExpirationTime) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Ensure OTP is compared as a string
    if (superAdmin.otp.toString() !== otpInput.toString()) {
      return res
        .status(400)
        .json({ message: "Incorrect OTP. Please try again." });
    }

    // Clear OTP fields after successful verification
    superAdmin.otp = null;
    superAdmin.otpTimestamp = null;
    await superAdmin.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Error verifying OTP." });
  }
});

router.post("/create-super-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists!" });
    }

    const existingSuperAdmin = await Admin.findOne({ role: "super-admin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "Super Admin already exists!" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password Before Save:", hashedPassword);

    const superAdmin = new Admin({
      name,
      email,
      password: hashedPassword, // Save hashed password
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

router.get("/super-admin", async (req, res) => {
  try {
    const superAdmin = await Admin.findOne({ role: "super-admin" });

    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    res.status(200).json(superAdmin);
  } catch (error) {
    console.error("Error fetching Super Admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/users/regular", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password"); // Exclude password field

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
