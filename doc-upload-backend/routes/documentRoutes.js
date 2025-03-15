const express = require("express");
const multer = require("multer");
const Web3 = require("web3");
const router = express.Router();
const { abi, address } = require("../contractABI.json");

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_API_URL)
);

const contract = new web3.eth.Contract(abi, address);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert file to base64 string
    const base64EncodedDoc = req.file.buffer.toString("base64");
    const documentName = req.file.originalname;
    const documentType = req.file.mimetype;

    const accounts = await web3.eth.getAccounts();

    const response = await contract.methods
      .uploadDocument(documentName, documentType, base64EncodedDoc)
      .send({
        from: accounts[0],
        gas: 3000000,
      });

    res.json({
      message: "Document uploaded successfully",
      documentId: response.events.DocumentUploaded.returnValues.documentId,
      transactionHash: response.transactionHash,
    });
  } catch (err) {
    console.error("Error uploading document:", err);
    res.status(500).json({
      message: "Error uploading document to blockchain",
      error: err.message,
    });
  }
});

module.exports = router;
