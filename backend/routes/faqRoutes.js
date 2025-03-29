const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');

// Get all FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await Faq.find();
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new FAQ (Admin use)
router.post('/', async (req, res) => {
    try {
        console.log("Received data:", req.body);  // Debugging step
        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ error: "Question and answer are required" });
        }

        const newFaq = new Faq({ question, answer });
        await newFaq.save();
        console.log("Saved to database:", newFaq);  // Debugging step

        res.status(201).json(newFaq);
    } catch (err) {
        console.error("Error saving FAQ:", err.message);
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;
