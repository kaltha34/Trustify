const express = require("express");
const multer = require("../middleware/multerConfig");
const {
  uploadFile,
  verifyDocument,
} = require("../controllers/uploadController");

const router = express.Router();

router.post("/upload", multer.single("file"), uploadFile); // Upload route
router.get("/verify/:fileHash", verifyDocument); // Verify route

module.exports = router;
