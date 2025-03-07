require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/UserRoutes.js");

const app = express();
const port = 5000;

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000", // Allow your frontend to connect
  methods: ["GET", "POST"],
};
app.use(cors(corsOptions));

const mongoURI = process.env.MONGODB_URI; // Make sure to set this in your .env file

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use("/api", usersRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
