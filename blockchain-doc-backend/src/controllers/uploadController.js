const crypto = require("crypto");
const { storeDocument, verifyDocument } = require("../config/blockchainConfig"); // Ensure the casing matches the actual file name

// Upload file, generate hash and store it
exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Generate file hash
    const fileHash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");

    // Store hash to mock blockchain (replace with Fabric later)
    await storeDocument(fileHash);

    res.json({
      message: "File uploaded & stored (Mocked)",
      filePath: `/uploads/${req.file.filename}`,
      fileHash,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Error processing file upload" });
  }
};

// Verify document hash (mocking blockchain check)
exports.verifyDocument = async (req, res) => {
  const { fileHash } = req.params;

  try {
    // Check hash in mock blockchain (replace with Fabric later)
    const exists = await verifyDocument(fileHash);

    res.json({
      exists,
      message: exists
        ? "Document is verified ✅ (Mocked)"
        : "Document not found ❌ (Mocked)",
    });
  } catch (error) {
    console.error("Error verifying document:", error);
    res.status(500).json({ error: "Error verifying document" });
  }
};
