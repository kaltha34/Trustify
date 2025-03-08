// models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "super-admin"],
    default: "admin",
  },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
