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

// **Login Function**
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = role === 'admin' 
      ? await Admin.findOne({ email }) 
      : await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const otp = generateOTP();

    await sendOTP(user, otp); // Send OTP using SendGrid

    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    socket.emit('notification', { message: `${role} logged in successfully` });

    res.status(200).json({ message: 'OTP sent to email', otp, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
