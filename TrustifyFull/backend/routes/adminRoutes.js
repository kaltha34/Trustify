const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// Get all admins
router.get("/", async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update admin status
router.put("/:id/status", async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        admin.status = admin.status === "offline" ? "online" : "offline";
        await admin.save();

        res.json({ message: "Status updated", status: admin.status });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




module.exports = router;
