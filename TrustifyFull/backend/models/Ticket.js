const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    issue: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved',"Replied"], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }},
    { timestamps: true 
});

module.exports = mongoose.model('Ticket', ticketSchema);
