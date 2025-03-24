require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");

const faqRoutes = require("./routes/faqRoutes");

const ticketRoutes = require("./routes/ticketRoutes");
const notificationRoutes = require("./routes/notifications");
const usersRoutes = require("./routes/superRoutes");
const bodyParser = require("body-parser");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIo(server); // Setting up socket.io server

app.use(cors()); // Allow cross-origin requests from the frontend (React app)

// Middleware
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", usersRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
