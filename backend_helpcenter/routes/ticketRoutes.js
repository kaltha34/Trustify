const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Get all tickets (Admin use)
router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit a support ticket
router.post('/', async (req, res) => {
    try {
        const { userEmail, issue } = req.body;
        const newTicket = new Ticket({ userEmail, issue });
        await newTicket.save();
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update ticket status
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
