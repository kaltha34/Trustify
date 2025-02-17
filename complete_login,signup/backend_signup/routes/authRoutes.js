const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// User Routes
router.post('/user/signup', authController.userSignup);
router.post('/user/login', authController.userLogin);

// Admin Routes
router.post('/admin/signup', authController.adminSignup);
router.post('/admin/login', authController.adminLogin);

router.post('/verify-otp', authController.verifyOTP);




module.exports = router;
