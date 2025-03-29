const express = require("express");
const multer = require("multer");
const { uploadImage, getImages } = require("../controllers/profileController");

const router = express.Router();

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("image"), uploadImage);
router.get("/images", getImages);

module.exports = router;
