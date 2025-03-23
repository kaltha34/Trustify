import express from 'express';
import multer from 'multer';
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

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Get document records by status
router.get("/approved", getApprovedRecords);
router.get("/pending", getPendingRecords);
router.get("/revoked", getRevokedRecords);

// Document management
router.get("/documents", getDocuments);
router.post("/upload", upload.single('file'), uploadDocument);
router.post("/verify", verifyDocument);
router.post("/revoke", revokeDocument);

export default router;
