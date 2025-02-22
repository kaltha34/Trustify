require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Import routes
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');  // Added User Routes

// Use routes
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes); // Added User Routes

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

