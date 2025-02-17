const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const sendOTP = async (user, otp) => {
  try {
    if (!user || !user.email) {
      throw new Error('User email not found');
    }

    const msg = {
      to: user.email,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: 'OTP for Login TRUSTIFY',
      html: `<p>Your OTP for login is: <strong>${otp}</strong></p>`,
    };

    await sgMail.send(msg);
    console.log('OTP sent successfully!');
  } catch (error) {
    console.error('Error sending OTP:', error.response ? error.response.body : error.message);
  }
};

// **User Signup Function**
exports.userSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    console.log("User registered successfully:", newUser);

    res.status(201).json({ message: 'User registered successfully' });
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
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();
    console.log("Admin registered successfully:", newAdmin);

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **User Login Function**
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpTimestamp = Date.now();
    await user.save();

    await sendOTP(user, otp);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'OTP sent to email', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Admin Login Function**
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const otp = generateOTP();
    admin.otp = otp;
    admin.otpTimestamp = Date.now();
    await admin.save();

    await sendOTP(admin, otp);

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'OTP sent to email', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Verify OTP Function**
exports.verifyOTP = async (req, res) => {
  const { otpInput, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id) || await Admin.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp) {
      return res.status(400).json({ message: 'No OTP found. Please request a new OTP.' });
    }

    const otpExpirationTime = 5 * 60 * 1000;
    const otpAge = Date.now() - user.otpTimestamp;

    if (otpAge > otpExpirationTime) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp !== otpInput) {
      return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
    }

    user.otp = null;
    user.otpTimestamp = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP.' });
  }
};
