const express = require("express");
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  uploadProfilePicture,
  getProfilePicture,
} = require("../controllers/profileController");
const multer = require("multer");

const router = express.Router();

// Multer setup for storing files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// User Routes
router.post("/user/signup", authController.userSignup);
router.post("/user/login", authController.userLogin);

// Admin Routes
router.post("/admin/signup", authController.adminSignup);
router.post("/admin/login", authController.adminLogin);

router.post("/verify-otp", authController.verifyOTP);

router.get("/admin/profile", authMiddleware, authController.AdminProfile);
router.get("/user-info/:email", authController.getUserInfo);
router.get("/admin-info/:email", authController.getAdminInfo);

// Profile Picture Routes (Protected)
router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("image"),
  uploadProfilePicture
);
router.get("/profile-picture", authMiddleware, getProfilePicture);

// Route for requesting password reset
router.post("/forgot-password", authController.forgotPassword);

// Route for verifying OTP for password reset
router.post("/verify-otp-reset", authController.verifyOTPForPasswordReset);

// Route for resetting password
router.post("/reset-password", authController.resetPassword);

module.exports = router;
