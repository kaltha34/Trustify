const express = require('express');
const authController = require('../controllers/authController');
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



// Route for requesting password reset
router.post('/forgot-password', authController.forgotPassword);

// Route for verifying OTP for password reset
router.post('/verify-otp-reset', authController.verifyOTPForPasswordReset);

// Route for resetting password
router.post('/reset-password', authController.resetPassword);

module.exports = router;
