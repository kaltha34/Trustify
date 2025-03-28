const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

const sgMail = require("@sendgrid/mail");
const sendFraudAlert = require("../utils/sendMail");
const sendResetPasswordOTP = require("../utils/sendResetPasswordOTP");
const sendOTP = require("../utils/sendLoginOTP");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Track failed login attempts
const failedLoginAttempts = {};

// **User Signup Function**
exports.userSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Admin Signup Function**
exports.adminSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **User Login Function**
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  failedLoginAttempts[email] = failedLoginAttempts[email] || 0;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      failedLoginAttempts[email]++;
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      failedLoginAttempts[email]++;

      if (failedLoginAttempts[email] >= 5) {
        await sendFraudAlert(email);
        await Insights.findOneAndUpdate(
          {},
          { $inc: { fraudAlerts: 1 } },
          { upsert: true }
        );
        failedLoginAttempts[email] = 0;
      }

      return res.status(400).json({ message: "Invalid credentials" });
    }

    failedLoginAttempts[email] = 0;

    const otp = generateOTP();
    console.log(otp);
    user.otp = otp;
    user.otpTimestamp = Date.now();
    await user.save();

    await sendOTP(user, otp);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({ message: "OTP sent to email", token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminInfo = async (req, res) => {
  try {
    const email = req.params.email;

    // Find the admin in the database
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Send admin data (excluding sensitive fields)
    res.json({
      name: admin.name,
      email: admin.email,
      role: admin.role, // Optional, if you store roles
    });
  } catch (error) {
    console.error("Error fetching admin info:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const email = req.params.email;

    // Find the user in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user data (excluding sensitive fields)
    res.json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// **Admin Login Function**
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  failedLoginAttempts[email] = failedLoginAttempts[email] || 0;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      failedLoginAttempts[email]++;
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      failedLoginAttempts[email]++;

      if (failedLoginAttempts[email] >= 5) {
        await sendFraudAlert(email);
        await Insights.findOneAndUpdate(
          {},
          { $inc: { fraudAlerts: 1 } },
          { upsert: true }
        );
        failedLoginAttempts[email] = 0;
      }

      return res.status(400).json({ message: "Invalid credentials" });
    }

    failedLoginAttempts[email] = 0;

    const otp = generateOTP();
    admin.otp = otp;
    admin.otpTimestamp = Date.now();
    await admin.save();

    await sendOTP(admin, otp);

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({ message: "OTP sent to email", token, userId: admin._id });
  } catch (error) {
    console.error("Error in adminLogin:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// **Verify OTP Function**
exports.verifyOTP = async (req, res) => {
  const { otpInput, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user =
      (await User.findById(decoded.id)) || (await Admin.findById(decoded.id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new OTP." });
    }

    const otpExpirationTime = 5 * 60 * 1000;
    const otpAge = Date.now() - user.otpTimestamp;

    if (otpAge > otpExpirationTime) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otpInput) {
      return res
        .status(400)
        .json({ message: "Incorrect OTP. Please try again." });
    }

    user.otp = null;
    user.otpTimestamp = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP." });
  }
};

// **Admin Profile Function**
exports.AdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **Forgot Password Request Function**
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpTimestamp = Date.now();
    await user.save();

    // Send reset password OTP email
    await sendResetPasswordOTP(user.email, otp);

    res.status(200).json({ message: "Reset password OTP sent successfully." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Error sending reset password OTP." });
  }
};

// **Verify OTP and allow password reset**
exports.verifyOTPForPasswordReset = async (req, res) => {
  const { otpInput, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new OTP." });
    }

    const otpExpirationTime = 5 * 60 * 1000; // 5 minutes expiration time
    const otpAge = Date.now() - user.otpTimestamp;

    if (otpAge > otpExpirationTime) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otpInput) {
      return res
        .status(400)
        .json({ message: "Incorrect OTP. Please try again." });
    }

    // OTP is valid, proceed to password reset
    user.otp = null;
    user.otpTimestamp = null;
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP." });
  }
};

// **Reset Password Function**
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    // Check if both passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password." });
  }
};
