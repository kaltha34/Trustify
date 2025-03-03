const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Ensure MONGO_URI is set in the .env file
    if (!process.env.MONGO_URI) {
      console.error("❌ MongoDB URI is missing in environment variables.");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;