import { create } from '@web3-storage/w3up-client';
import { ethers } from 'ethers';
import * as fs from 'fs';
import path from 'path';

// ABI for the IdentityDocuments contract
const IDENTITY_DOCUMENTS_ABI = [
    "function uploadDocument(uint8 _docType, string memory _ipfsHash) public",
    "function getDocument(address _user, uint8 _docType) public view returns (tuple(uint8 docType, string ipfsHash, uint256 timestamp, bool isValid))",
    "function hasValidDocument(address _user, uint8 _docType) public view returns (bool)",
    "event DocumentUploaded(address indexed user, uint8 docType, string ipfsHash)"
];

export class DocumentManager {
    constructor(contractAddress, providerUrl) {
        this.contractAddress = contractAddress;
        this.providerUrl = providerUrl;
        this.documentTypes = {
            NIC: 0,
            BIRTH_CERTIFICATE: 1,
            PASSPORT: 2
        };
    }

    async initialize() {
        // Initialize Web3.Storage client
        this.storageClient = await create();
        this.spaceDid = 'did:key:z6Mkhi9HRVD3LGqEG2KuNFgZzC8BVyvcejP4XyHac29dzhA9';
        await this.storageClient.setCurrentSpace(this.spaceDid);

        // Initialize Ethereum provider and contract
        this.provider = new ethers.JsonRpcProvider(this.providerUrl);
        this.contract = new ethers.Contract(
            this.contractAddress,
            IDENTITY_DOCUMENTS_ABI,
            this.provider
        );
    }

    async uploadDocument(docType, filePath, walletAddress) {
        try {
            // Validate inputs
            if (!(docType in this.documentTypes)) {
                throw new Error(`Invalid document type. Supported types: ${Object.keys(this.documentTypes).join(', ')}`);
            }
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }
            if (!ethers.isAddress(walletAddress)) {
                throw new Error('Invalid Ethereum address');
            }

            // Create metadata
            const metadata = {
                type: docType,
                owner: walletAddress,
                timestamp: new Date().toISOString(),
                filename: path.basename(filePath)
            };

            // Read file and create File objects
            const fileContent = await fs.promises.readFile(filePath);
            const fileName = path.basename(filePath);
            
            // Create document and metadata files
            const documentFile = new File([fileContent], fileName);
            const metadataFile = new File(
                [JSON.stringify(metadata, null, 2)],
                'metadata.json',
                { type: 'application/json' }
            );

            // Upload to Web3.Storage
            console.log(`🔹 Uploading ${docType} document to IPFS...`);
            const cid = await this.storageClient.uploadDirectory([documentFile, metadataFile]);

            // Store reference in blockchain
            console.log('🔹 Storing document reference in blockchain...');
            const tx = await this.contract.uploadDocument(
                this.documentTypes[docType],
                cid
            );
            await tx.wait();

            const documentInfo = {
                type: docType,
                owner: walletAddress,
                ipfsHash: cid,
                ipfsUrl: `https://w3s.link/ipfs/${cid}`,
                timestamp: new Date().toISOString()
            };

            console.log('\n✅ Document uploaded successfully!');
            console.log('📝 Document details:', JSON.stringify(documentInfo, null, 2));

            return documentInfo;

        } catch (error) {
            console.error('❌ Upload failed:', error.message);
            throw error;
        }
    }

    async getDocument(walletAddress, docType) {
        try {
            if (!(docType in this.documentTypes)) {
                throw new Error(`Invalid document type. Supported types: ${Object.keys(this.documentTypes).join(', ')}`);
            }

            const doc = await this.contract.getDocument(walletAddress, this.documentTypes[docType]);
            
            if (!doc.isValid) {
                throw new Error('Document not found or has been revoked');
            }

            return {
                type: docType,
                owner: walletAddress,
                ipfsHash: doc.ipfsHash,
                ipfsUrl: `https://w3s.link/ipfs/${doc.ipfsHash}`,
                timestamp: new Date(doc.timestamp * 1000).toISOString(),
                isValid: doc.isValid
            };

        } catch (error) {
            console.error('❌ Error fetching document:', error.message);
            throw error;
        }
    }

    async verifyDocument(walletAddress, docType) {
        try {
            return await this.contract.hasValidDocument(walletAddress, this.documentTypes[docType]);
        } catch (error) {
            console.error('❌ Error verifying document:', error.message);
            throw error;
        }
    }
}
