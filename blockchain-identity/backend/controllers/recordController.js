import blockchainService from "../services/blockchainService.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getApprovedRecords = async (req, res) => {
  try {
    const { walletAddress } = req.query;
    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }
    const records = await blockchainService.getApprovedRecords(walletAddress);
    res.json(records);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Error fetching approved records" });
  }
};

export const getPendingRecords = async (req, res) => {
  try {
    const { walletAddress } = req.query;
    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }
    const records = await blockchainService.getPendingRecords(walletAddress);
    res.json(records);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Error fetching pending records" });
  }
};

export const getRevokedRecords = async (req, res) => {
  try {
    const { walletAddress } = req.query;
    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }
    const records = await blockchainService.getRevokedRecords(walletAddress);
    res.json(records);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Error fetching revoked records" });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const { walletAddress } = req.query;
    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }
    const documents = await blockchainService.getDocuments(walletAddress);
    res.json(documents);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Error fetching documents" });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    console.log('Upload request received:', {
      body: req.body,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'No file'
    });

    const { docType, walletAddress } = req.body;
    if (!docType || !walletAddress || !req.file) {
      console.error('Missing required fields:', { docType, walletAddress, hasFile: !!req.file });
      return res.status(400).json({ error: "Document type, wallet address, and file are required" });
    }

    // Create temporary file from buffer
    const tempDir = join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = join(tempDir, req.file.originalname);
    console.log('Writing to temp file:', tempFilePath);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    try {
      console.log('Calling blockchain service with:', { docType, tempFilePath, walletAddress });
      const result = await blockchainService.uploadDocument(docType, tempFilePath, walletAddress);
      console.log('Upload successful:', result);
      res.json(result);
    } catch (error) {
      console.error('Blockchain service error:', error);
      res.status(500).json({ error: error.message || "Error uploading to blockchain" });
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        console.log('Temp file cleaned up');
      }
    }
  } catch (error) {
    console.error('Upload controller error:', error);
    res.status(500).json({ error: error.message || "Error uploading document" });
  }
};

export const verifyDocument = async (req, res) => {
  try {
    const { walletAddress, docType } = req.body;
    if (!walletAddress || !docType) {
      return res.status(400).json({ error: "Wallet address and document type are required" });
    }
    const result = await blockchainService.verifyDocument(walletAddress, docType);
    res.json({ success: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Error verifying document" });
  }
};

export const revokeDocument = async (req, res) => {
  try {
    const { walletAddress, docType } = req.body;
    if (!walletAddress || !docType) {
      return res.status(400).json({ error: "Wallet address and document type are required" });
    }
    const result = await blockchainService.revokeDocument(walletAddress, docType);
    res.json({ success: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Error revoking document" });
  }
};
