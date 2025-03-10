import blockchainService from "../services/blockchainService.js";

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
    const { docType, filePath, walletAddress } = req.body;
    if (!docType || !filePath || !walletAddress) {
      return res.status(400).json({ error: "Document type, file path, and wallet address are required" });
    }
    const result = await blockchainService.uploadDocument(docType, filePath, walletAddress);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Error uploading document" });
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
