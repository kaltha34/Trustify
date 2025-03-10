import express from 'express';
import {
    getApprovedRecords,
    getPendingRecords,
    getRevokedRecords,
    getDocuments,
    uploadDocument,
    verifyDocument,
    revokeDocument
} from '../controllers/recordController.js';

const router = express.Router();

// Get document records by status
router.get("/approved", getApprovedRecords);
router.get("/pending", getPendingRecords);
router.get("/revoked", getRevokedRecords);

// Document management
router.get("/documents", getDocuments);
router.post("/upload", uploadDocument);
router.post("/verify", verifyDocument);
router.post("/revoke", revokeDocument);

export default router;
