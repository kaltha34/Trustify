const express = require("express");
const axios = require("axios"); // For blockchain API calls
const User = require("../models/userModel");
const router = express.Router();

// Blockchain API placeholder (Replace with actual API URL)
const BLOCKCHAIN_API = "https://your-blockchain-api.com/data";

router.get("/insights", async (req, res) => {
  try {
    // Count all users in MongoDB (Total registered users)
    const totalUsers = await User.countDocuments();

    // Count fraud alerts (Users with 5+ failed login attempts)
    const fraudAlertsCount = await User.countDocuments({ passwordAttempts: { $gte: 5 } });

    // Fetch data from Blockchain API
    const blockchainResponse = await axios.get(BLOCKCHAIN_API);
    const blockchainData = blockchainResponse.data; // Assume it returns an object

    // Construct response
    const insightsData = {
      verifiedUsers: totalUsers, // Now includes ALL users
      fraudAlerts: fraudAlertsCount,
      govVerifications: blockchainData.govVerifications,
      monthlyActivityReport: blockchainData.monthlyActivityReport,
      securityStatus: blockchainData.securityStatus, // Encryption & Access Control
      recentTransactions: blockchainData.recentTransactions, // Transactions from blockchain
      blockchainLink: BLOCKCHAIN_API,
    };

    res.json(insightsData);
  } catch (error) {
    console.error("Error fetching insights:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
