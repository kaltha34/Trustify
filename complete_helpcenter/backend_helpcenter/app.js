require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors'); // CORS module for enabling cross-origin requests

const faqRoutes = require('./routes/faqRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Create an HTTP server
const server = http.createServer(app);

// Initialize socket.io on the server
const io = socketIo(server);

// Middleware
app.use(cors()); // Allow cross-origin requests from the frontend (React app)
app.use(express.json()); // JSON parsing for incoming requests

// Routes
app.use('/api/faqs', faqRoutes);
app.use('/api/tickets', ticketRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// WebSocket connection (for real-time notifications, updates, etc.)
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle events if needed (e.g., listen for new ticket updates or FAQ clicks)
  socket.on('new-ticket', (ticket) => {
    // Example: Emit an event to notify the client about the new ticket
    io.emit('ticket-created', ticket);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Error-handling middleware (for general server errors)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
