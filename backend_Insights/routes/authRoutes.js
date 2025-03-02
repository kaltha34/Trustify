const express = require("express");
const authController = require("../controllers/authController"); // Ensure correct path
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// User Routes
router.post('/user/signup', authController.userSignup);
router.post('/user/login', authController.userLogin);

// Admin Routes
router.post('/admin/signup', authController.adminSignup);
router.post('/admin/login', authController.adminLogin);

router.post('/verify-otp', authController.verifyOTP);

router.get("/admin/profile", authMiddleware, authController.AdminProfile);

module.exports = router;
