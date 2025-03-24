import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const IDENTITY_DOCUMENTS_ABI = [
    "function uploadDocument(uint8 _docType, string memory _ipfsHash) public",
    "function getDocument(address _user, uint8 _docType) public view returns (string memory ipfsHash, uint256 timestamp, bool isValid, bool isVerified, address verifiedBy)",
    "function hasValidDocument(address _user, uint8 _docType) public view returns (bool)",
    "function verifyDocument(address _user, uint8 _docType) external",
    "function revokeDocument(uint8 _docType) public",
    "function isVerifier(address _address) public view returns (bool)"
];

const PINATA_API_URL = 'https://api.pinata.cloud';

// Document types enum matching the smart contract
const DocumentType = {
    NIC: 0,
    BIRTH_CERTIFICATE: 1,
    PASSPORT: 2
};

export class DocumentManager {
    constructor(contractAddress, rpcUrl) {
        this.contractAddress = "0xF84098EE1b988D6ddC6ab5864E464A97a15913C5"; 
        this.rpcUrl = rpcUrl;
        this.contract = null;
    }

    async initialize() {
        if (!process.env.PINATA_API_KEY || !process.env.PINATA_API_SECRET) {
            throw new Error('PINATA_API_KEY or PINATA_API_SECRET not found in .env file');
        }

        try {
            // Initialize contract
            const provider = new ethers.JsonRpcProvider(this.rpcUrl);
            const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            this.contract = new ethers.Contract(this.contractAddress, IDENTITY_DOCUMENTS_ABI, signer);
            console.log('DocumentManager initialized with contract:', this.contractAddress);
        } catch (error) {
            console.error('Error initializing DocumentManager:', error);
            throw error;
        }
    }

    async uploadToIPFS(fileContent, metadata) {
        try {
            // Create a single JSON file containing both the document and metadata
            const formData = new FormData();
            
            // Convert file content to base64
            const base64Content = fileContent.toString('base64');
            
            // Create a combined payload
            const payload = {
                document: base64Content,
                metadata: metadata
            };

            // Add the combined JSON file
            formData.append('file', Buffer.from(JSON.stringify(payload, null, 2)), {
                filename: 'document.json',
                contentType: 'application/json'
            });

            // Add pinata metadata
            formData.append('pinataMetadata', JSON.stringify({
                name: `Trustify Identity Document - ${metadata.type}`,
                keyvalues: {
                    app: 'trustify',
                    type: 'identity',
                    docType: metadata.type,
                    owner: metadata.owner
                }
            }));

            // Upload to Pinata
            const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
                method: 'POST',
                headers: {
                    'pinata_api_key': process.env.PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.PINATA_API_SECRET
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Failed to upload to Pinata: ${error}`);
            }

            const result = await response.json();
            return result.IpfsHash;

        } catch (error) {
            console.error('IPFS upload error:', error);
            throw new Error(`Failed to upload to IPFS: ${error.message}`);
        }
    }

    async uploadDocument(docType, filePath, walletAddress) {
        if (!this.contract) {
            throw new Error('DocumentManager not initialized. Call initialize() first.');
        }

        // Validate inputs
        if (!(docType in DocumentType)) {
            throw new Error(`Invalid document type. Supported types: ${Object.keys(DocumentType).join(', ')}`);
        }
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        if (!ethers.isAddress(walletAddress)) {
            throw new Error('Invalid Ethereum address');
        }

        try {
            // Create metadata
            const metadata = {
                type: docType,
                owner: walletAddress,
                timestamp: new Date().toISOString(),
                filename: path.basename(filePath)
            };

            // Read file content
            const fileContent = await fs.promises.readFile(filePath);
            
            // Upload to IPFS
            console.log(' Uploading to IPFS via Pinata...');
            const cid = await this.uploadToIPFS(fileContent, metadata);
            console.log(' Files uploaded to IPFS:', cid);

            // Store in blockchain
            console.log(' Storing document reference in blockchain...');
            const tx = await this.contract.uploadDocument(DocumentType[docType], cid);
            await tx.wait();
            console.log(' Document reference stored in blockchain');

            return {
                docType,
                ipfsHash: cid,
                ipfsUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
                owner: walletAddress,
                timestamp: metadata.timestamp
            };

        } catch (error) {
            console.error(' Upload failed:', error.message);
            throw error;
        }
    }

    async verifyDocument(walletAddress, docType) {
        if (!this.contract) {
            throw new Error('DocumentManager not initialized. Call initialize() first.');
        }

        if (!(docType in DocumentType)) {
            throw new Error(`Invalid document type. Supported types: ${Object.keys(DocumentType).join(', ')}`);
        }

        try {
            const doc = await this.contract.getDocument(walletAddress, DocumentType[docType]);
            return doc.isValid && doc.isVerified;
        } catch (error) {
            console.error(' Verification failed:', error.message);
            throw error;
        }
    }

    async getDocument(walletAddress, docType) {
        if (!this.contract) {
            throw new Error('DocumentManager not initialized. Call initialize() first.');
        }

        if (!(docType in DocumentType)) {
            throw new Error(`Invalid document type. Supported types: ${Object.keys(DocumentType).join(', ')}`);
        }

        try {
            const doc = await this.contract.getDocument(walletAddress, DocumentType[docType]);
            return {
                ipfsHash: doc.ipfsHash,
                timestamp: doc.timestamp.toString(),
                isValid: doc.isValid,
                isVerified: doc.isVerified,
                verifiedBy: doc.verifiedBy,
                ipfsUrl: `https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`
            };
        } catch (error) {
            console.error(' Error retrieving document:', error.message);
            throw error;
        }
    }
}
