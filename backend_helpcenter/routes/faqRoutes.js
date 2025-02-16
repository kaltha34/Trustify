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
        const { question, answer } = req.body;
        const newFaq = new Faq({ question, answer });
        await newFaq.save();
        res.status(201).json(newFaq);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
