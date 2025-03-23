import { PinataService } from '../backend/services/pinataService.js';
import { BlockchainService } from '../backend/services/blockchainService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from both root and backend .env files
dotenv.config(); // Load backend .env
dotenv.config({ path: path.join(__dirname, '../.env') }); // Load root .env

// Custom error class for DocumentManager
class DocumentManagerError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.name = 'DocumentManagerError';
        this.code = code;
        this.details = details;
    }
}

export class DocumentManager {
    constructor() {
        this.pinataService = new PinataService();
        this.blockchainService = new BlockchainService();
        this.initialized = false;
    }

    async initialize() {
        try {
            console.log('\nInitializing DocumentManager...');
            
            // Initialize services
            await this.pinataService.initialize();
            await this.blockchainService.initialize();

            this.initialized = true;
            console.log('\n✅ DocumentManager initialized successfully');
            return true;
        } catch (error) {
            console.error('\n❌ DocumentManager initialization failed:', {
                name: error.name,
                code: error.code,
                message: error.message,
                details: error.details
            });
            throw error;
        }
    }

    async uploadDocument(docType, filePath) {
        try {
            if (!this.initialized) {
                throw new DocumentManagerError(
                    'DocumentManager not initialized',
                    'SERVICE_ERROR',
                    { helpMessage: 'Call initialize() before uploading documents' }
                );
            }

            // Upload file to IPFS via Pinata
            const ipfsHash = await this.pinataService.uploadFile(filePath);

            // Upload document to blockchain
            const tx = await this.blockchainService.uploadDocument(docType, ipfsHash);

            return {
                transactionHash: tx.transactionHash,
                ipfsHash
            };
        } catch (error) {
            throw new DocumentManagerError(
                'Failed to upload document',
                'UPLOAD_ERROR',
                {
                    docType,
                    filePath,
                    originalError: error.message
                }
            );
        }
    }

    async getDocument(docType) {
        try {
            if (!this.initialized) {
                throw new DocumentManagerError(
                    'DocumentManager not initialized',
                    'SERVICE_ERROR',
                    { helpMessage: 'Call initialize() before getting document details' }
                );
            }

            const doc = await this.blockchainService.getDocument(docType);
            return doc;
        } catch (error) {
            throw new DocumentManagerError(
                'Failed to get document details',
                'QUERY_ERROR',
                {
                    docType,
                    originalError: error.message
                }
            );
        }
    }

    async verifyDocument(docType) {
        try {
            if (!this.initialized) {
                throw new DocumentManagerError(
                    'DocumentManager not initialized',
                    'SERVICE_ERROR',
                    { helpMessage: 'Call initialize() before verifying documents' }
                );
            }

            const tx = await this.blockchainService.verifyDocument(docType);
            return tx;
        } catch (error) {
            throw new DocumentManagerError(
                'Failed to verify document',
                'VERIFICATION_ERROR',
                {
                    docType,
                    originalError: error.message
                }
            );
        }
    }
}
