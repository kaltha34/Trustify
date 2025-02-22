const express = require('express');
const axios = require('axios');
const router = express.Router();

const BLOCKCHAIN_API = process.env.BLOCKCHAIN_API;

// Fetch all documents from the blockchain
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BLOCKCHAIN_API}/documents`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents", error: err.message });
  }
});

// Fetch documents by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const response = await axios.get(`${BLOCKCHAIN_API}/documents/user/${req.params.userId}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's documents", error: err.message });
  }
});

// Update document status (Approve or Block)
router.put('/status/:docId', async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "blocked"
    if (!["approved", "blocked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Allowed: 'approved', 'blocked'" });
    }

    const response = await axios.put(`${BLOCKCHAIN_API}/documents/status/${req.params.docId}`, { status });

    res.json({ message: `Document ${status} successfully`, data: response.data });
  } catch (err) {
    res.status(500).json({ message: "Error updating document status", error: err.message });
  }
});

// Approve (Unblock) a document
router.put('/approve/:id', async (req, res) => {
  try {
    const response = await axios.put(`${BLOCKCHAIN_API}/documents/status/${req.params.id}`, { status: "approved" });
    res.json({ message: "Document approved", data: response.data });
  } catch (err) {
    res.status(500).json({ message: "Error approving document", error: err.message });
  }
});

// Block a document
router.put('/block/:id', async (req, res) => {
  try {
    const response = await axios.put(`${BLOCKCHAIN_API}/documents/status/${req.params.id}`, { status: "blocked" });
    res.json({ message: "Document blocked", data: response.data });
  } catch (err) {
    res.status(500).json({ message: "Error blocking document", error: err.message });
  }
});

module.exports = router;
