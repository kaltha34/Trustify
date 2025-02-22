const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Import the DB connection function
require("dotenv").config();
const notificationRoutes = require("./routes/notifications");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Connect to MongoDB
connectDB(); // Call the function to connect to MongoDB

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notifications", notificationRoutes);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

