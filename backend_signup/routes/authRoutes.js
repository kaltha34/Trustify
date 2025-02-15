const express = require('express');
const { signup, login,verifyOTP } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verifyOtp', verifyOTP);

module.exports = router;
