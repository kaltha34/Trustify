const express = require("express");
const User = require("../models/User");
const Admin = require("../models/Admin");

const router = express.Router();

// Fetch all regular users
router.get("/users/regular", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Fetch all admins
router.get("/admins", async (req, res) => {
  try {
    const admins = await Admin.find().sort({
      role: "super-admin",
      createdAt: -1,
    });
    res.status(200).json(admins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
});

// Assign user as admin
router.post("/assignAdmin", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "User is already an admin" });
    }

    const newAdmin = new Admin({
      name: user.name,
      email: user.email,
      password: user.password, // Keeping hashed password
      role: "admin",
      createdAt: user.createdAt,
    });

    await newAdmin.save();

    const updatedAdmins = await Admin.find();
    res
      .status(200)
      .json({ message: "User assigned as admin successfully", updatedAdmins });
  } catch (error) {
    console.error("Error assigning admin:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Remove admin
router.post("/removeAdmin", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOneAndDelete({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Restore as a regular user if not already present
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await new User({
        name: admin.name,
        email: admin.email,
        password: admin.password,
        role: "user",
        createdAt: admin.createdAt,
      }).save();
    }

    const updatedAdmins = await Admin.find();
    res
      .status(200)
      .json({ message: "Admin removed successfully", updatedAdmins });
  } catch (error) {
    console.error("Error removing admin:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/login-super-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debugging logs
    console.log("Received email:", email);
    console.log("Received password:", password);

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Find Super Admin in the database
    const superAdmin = await User.findOne({ email, role: "super-admin" });
    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found!" });
    }

    console.log("Stored hashed password in DB:", superAdmin.password);

    //  Compare password correctly
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: superAdmin._id, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Super Admin Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create-super-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists!" });
    }

    const existingSuperAdmin = await User.findOne({ role: "super-admin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "Super Admin already exists!" });
    }
    const superAdmin = new User({
      name,
      email,
      password,
      role: "super-admin",
    });

    await superAdmin.save();

    const admin = new Admin({
      _id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
      password: superAdmin.password,
      role: superAdmin.role,
      createdAt: superAdmin.createdAt,
    });

    await admin.save();
    await User.deleteOne({ _id: superAdmin._id });

    res
      .status(201)
      .json({ message: "Super Admin created successfully!", superAdmin });
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/super-admin", async (req, res) => {
  try {
    const superAdmin = await Admin.findOne({ role: "super-admin" });
    if (!superAdmin) {
      superAdmin = await User.findOne({ role: "super-admin" });
    }
    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    res.status(200).json(superAdmin);
  } catch (error) {
    console.error("Error fetching Super Admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/users/regular", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password"); // Exclude password field

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
