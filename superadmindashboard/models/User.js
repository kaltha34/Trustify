const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "super-admin"],
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Ensure only one super-admin exists
userSchema.pre("save", async function (next) {
  if (this.role === "super-admin" && this.isNew) {
    const existingSuperAdmin = await mongoose
      .model("User")
      .findOne({ role: "super-admin" });
    if (existingSuperAdmin) {
      return next(new Error("Super Admin already exists!"));
    }
  }

  // ✅ Prevent double hashing
  if (this.isModified("password") && !this.password.startsWith("$2b$")) {
    console.log("Hashing password before saving...");
    this.password = await bcrypt.hash(this.password, 10);
  } else {
    console.log("Password is already hashed, skipping...");
  }

  next();
});

// ✅ Prevent changing a super-admin's role
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.role && update.role !== "super-admin") {
    const existingSuperAdmin = await mongoose
      .model("User")
      .findOne({ role: "super-admin" });
    if (existingSuperAdmin) {
      return next(new Error("Super Admin role cannot be changed!"));
    }
  }

  // Hash new password if being updated
  if (update.password && !update.password.startsWith("$2b$")) {
    console.log("Hashing password before update...");
    update.password = await bcrypt.hash(update.password, 10);
  }

  next();
});

// ✅ Method to compare passwords correctly
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
