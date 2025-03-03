const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Import DB connection
require("dotenv").config(); // Load environment variables
const notificationRoutes = require("./routes/notifications");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Connect to MongoDB
connectDB(); // Call the function to connect to MongoDB

// Configure CORS
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL if deployed
  credentials: true,
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/notifications", notificationRoutes); // Notifications routes

// Error Handling Middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));