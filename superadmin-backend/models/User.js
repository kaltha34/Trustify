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

userSchema.pre("save", async function (next) {
  if (this.role === "super-admin") {
    const existingSuperAdmin = await mongoose
      .model("User")
      .findOne({ role: "super-admin" });
    if (
      existingSuperAdmin &&
      existingSuperAdmin._id.toString() !== this._id.toString()
    ) {
      return next(new Error("Super Admin already exists!"));
    }
  }

  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const existingSuperAdmin = await mongoose
    .model("User")
    .findOne({ role: "super-admin" });

  if (update.role && update.role !== "super-admin" && existingSuperAdmin) {
    return next(new Error("Super Admin role cannot be changed!"));
  }

  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
