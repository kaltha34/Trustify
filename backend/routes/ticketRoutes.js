const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const sendAdminReplyEmail = require('../utils/adminReply');
const Notification = require("../models/Notification");
const sgMail = require('@sendgrid/mail');




sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// Get the latest unanswered ticket
router.get('/latest', async (req, res) => {
    try {
        const latestTicket = await Ticket.findOne({ status: "Pending" }).sort({ createdAt: -1 });
        if (!latestTicket) {
            return res.json({ question: "No questions available", ticketId: null });
        }
        res.json({ question: latestTicket.issue, ticketId: latestTicket._id });
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





// Admin replies to a ticket, stores the reply in notifications, and sends an email



router.post("/reply/:id", async (req, res) => {
  try {
    const { reply } = req.body;

    // Find the ticket by ID
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Log the ticket to see if userEmail is populated
    console.log("Ticket found:", ticket);
    console.log("User email:", ticket.userEmail);  // Ensure this is correct

    // Ensure the recipient email is valid
    if (!ticket.userEmail || !/\S+@\S+\.\S+/.test(ticket.userEmail)) {
      return res.status(400).json({ error: "Invalid user email." });
    }

    // Store the reply in notifications
    const notification = new Notification({
      userEmail: ticket.userEmail,
      message: `Admin replied: "${reply}"`,
      reply,
    });

    await notification.save();

    // Send the admin reply email using the pre-existing sendAdminReplyEmail function
    await sendAdminReplyEmail(ticket.userEmail, reply);  // This should now work

    
    // Update ticket status to resolved
    ticket.status = 'Resolved';
    await ticket.save();


    // Respond with success message
    res.json({ message: "Reply sent, stored in inbox, and email sent!" });
  } catch (error) {
    // Log error and provide feedback
    console.error("Error:", error.message || error);
    res.status(500).json({ error: "Failed to send email or save notification." });
  }
});

module.exports = router;
