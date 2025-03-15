require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend's origin
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use(
  "/api",
  (req, res, next) => {
    req.io = io;
    next();
  },
  notificationRoutes
);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("send_notification", (data) => {
    console.log("Notification data received:", data);
    io.emit("new_notification", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
