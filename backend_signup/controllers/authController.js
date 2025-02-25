const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const io = require('socket.io-client');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const socket = io.connect('http://localhost:5000'); // Connecting to WebSocket server

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set SendGrid API Key

// Function to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Function to send OTP Email using SendGrid
const sendOTP = async (user, otp) => {
  try {
    console.log("User object received in sendOTP:", user);
    
    if (!user || !user.email) {
      throw new Error('User email not found');
    }

    console.log("Sending OTP using email:", user.email);

    const msg = {
      to: user.email,
      from: process.env.SENDGRID_SENDER_EMAIL, // Use your verified SendGrid sender email
      subject: 'OTP for Login TRUSTIFY',
      html: `<p>Your OTP for login is: <strong>${otp}</strong></p>`,
    };

    await sgMail.send(msg);
    console.log('OTP sent successfully!');
  } catch (error) {
    console.error('Error sending OTP:', error.response ? error.response.body : error.message);
  
  }
};

// **Signup Function**
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = role === 'admin' 
      ? await Admin.findOne({ email }) 
      : await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = role === 'admin' 
      ? new Admin({ name, email, password: hashedPassword }) 
      : new User({ name, email, password: hashedPassword });

    await newUser.save();
    console.log("User registered successfully:", newUser);

    res.status(201).json({ message: 'User registered successfully' });
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

    // Send OTP email and wait for completion
    await sendOTP(admin, otp);

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send final response after OTP is sent
    return res.status(200).json({ 
      message: 'OTP sent to email', 
      token,
      
    });

  } catch (error) {
    console.error('Error in adminLogin:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

// **Verify OTP Function**
exports.verifyOTP = async (req, res) => {
  const { otpInput, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP exists and has expired
    if (!user.otp) {
      return res.status(400).json({ message: 'No OTP found. Please request a new OTP.' });
    }

    const otpExpirationTime = 5 * 60 * 1000; // OTP expiration time (5 minutes)
    const otpAge = Date.now() - user.otpTimestamp;

    if (otpAge > otpExpirationTime) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check if the OTP matches
    if (user.otp !== otpInput) {
      return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
    }

    // OTP is valid, clear OTP fields
    user.otp = null; // Clear OTP after successful verification
    user.otpTimestamp = null; // Clear OTP timestamp
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP.' });
  }
};
