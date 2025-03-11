import { ethers } from 'ethers';
import { DocumentManager } from '../../utils/DocumentManager.js';
import dotenv from 'dotenv';

dotenv.config();

const IDENTITY_VERIFICATION_ABI = [
    "function isVerifier(address _address) public view returns (bool)",
    "function addVerifier(address _verifier) external",
    "function removeVerifier(address _verifier) external",
    "function getUserStatus(address _user) public view returns (bool isRegistered, bool isVerified)"
];

const IDENTITY_DOCUMENTS_ABI = [
    "function uploadDocument(uint8 _docType, string memory _ipfsHash) public",
    "function getDocument(address _user, uint8 _docType) public view returns (string memory ipfsHash, uint256 timestamp, bool isValid, bool isVerified, address verifiedBy)",
    "function hasValidDocument(address _user, uint8 _docType) public view returns (bool)",
    "function verifyDocument(address _user, uint8 _docType) external",
    "function revokeDocument(uint8 _docType) public",
    "function isVerifier(address _address) public view returns (bool)"
];

class BlockchainService {
    constructor() {
        // SKALE Testnet Configuration
        this.provider = new ethers.JsonRpcProvider("https://testnet.skalenodes.com/v1/giant-half-dual-testnet");
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        
        // Initialize contracts with deployed addresses
        this.verificationContract = new ethers.Contract(
            "0x123676956F35d9791bf3d679a9f0E0f293427a35",
            IDENTITY_VERIFICATION_ABI,
            this.signer
        );
        
        this.documentsContract = new ethers.Contract(
            "0xF84098EE1b988D6ddC6ab5864E464A97a15913C5",
            IDENTITY_DOCUMENTS_ABI,
            this.signer
        );

        this.documentManager = new DocumentManager(
            "0xF84098EE1b988D6ddC6ab5864E464A97a15913C5",
            "https://testnet.skalenodes.com/v1/giant-half-dual-testnet"
        );
    }

    async initialize() {
        try {
            await this.documentManager.initialize();
            const isVerifier = await this.verificationContract.isVerifier(await this.signer.getAddress());
            console.log('Blockchain service initialized successfully. Verifier status:', isVerifier);
        } catch (error) {
            console.error('Error initializing blockchain service:', error);
            throw error;
        }
    }

    async getApprovedRecords(userAddress) {
        try {
            const documentTypes = ['NIC', 'BIRTH_CERTIFICATE', 'PASSPORT'];
            const records = [];

            for (const docType of documentTypes) {
                try {
                    const doc = await this.documentsContract.getDocument(userAddress, this._getDocTypeEnum(docType));
                    if (doc.isValid && doc.isVerified) {
                        records.push({
                            type: docType,
                            ipfsHash: doc.ipfsHash,
                            timestamp: Number(doc.timestamp).toString(),
                            verifiedBy: doc.verifiedBy
                        });
                    }
                } catch (error) {
                    console.log(`No ${docType} document found for ${userAddress}`);
                }
            }

            return records;
        } catch (error) {
            console.error('Error fetching approved records:', error);
            throw error;
        }
    }

    async getPendingRecords(userAddress) {
        try {
            const documentTypes = ['NIC', 'BIRTH_CERTIFICATE', 'PASSPORT'];
            const records = [];

            for (const docType of documentTypes) {
                try {
                    const doc = await this.documentsContract.getDocument(userAddress, this._getDocTypeEnum(docType));
                    if (doc.isValid && !doc.isVerified) {
                        records.push({
                            type: docType,
                            ipfsHash: doc.ipfsHash,
                            timestamp: Number(doc.timestamp).toString()
                        });
                    }
                } catch (error) {
                    console.log(`No ${docType} document found for ${userAddress}`);
                }
            }

            return records;
        } catch (error) {
            console.error('Error fetching pending records:', error);
            throw error;
        }
    }

    async getRevokedRecords(userAddress) {
        try {
            const documentTypes = ['NIC', 'BIRTH_CERTIFICATE', 'PASSPORT'];
            const records = [];

            for (const docType of documentTypes) {
                try {
                    const doc = await this.documentsContract.getDocument(userAddress, this._getDocTypeEnum(docType));
                    if (!doc.isValid) {
                        records.push({
                            type: docType,
                            ipfsHash: doc.ipfsHash,
                            timestamp: Number(doc.timestamp).toString(),
                            verifiedBy: doc.verifiedBy
                        });
                    }
                } catch (error) {
                    console.log(`No ${docType} document found for ${userAddress}`);
                }
            }

            return records;
        } catch (error) {
            console.error('Error fetching revoked records:', error);
            throw error;
        }
    }

    async getDocuments(userAddress) {
        try {
            const documentTypes = ['NIC', 'BIRTH_CERTIFICATE', 'PASSPORT'];
            const documents = [];

            const userStatus = await this.verificationContract.getUserStatus(userAddress);

            for (const docType of documentTypes) {
                try {
                    const doc = await this.documentsContract.getDocument(userAddress, this._getDocTypeEnum(docType));
                    if (doc.ipfsHash !== '') {
                        documents.push({
                            type: docType,
                            ipfsHash: doc.ipfsHash,
                            ipfsUrl: `https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`,
                            timestamp: Number(doc.timestamp).toString(),
                            isValid: doc.isValid,
                            isVerified: doc.isVerified,
                            verifiedBy: doc.verifiedBy,
                            userVerified: userStatus.isVerified
                        });
                    }
                } catch (error) {
                    console.log(`No ${docType} document found for ${userAddress}`);
                }
            }

            return documents;
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw error;
        }
    }

    async uploadDocument(docType, filePath, userAddress) {
        try {
            const userStatus = await this.verificationContract.getUserStatus(userAddress);
            if (!userStatus.isRegistered) {
                throw new Error("User is not registered in the system");
            }
            return await this.documentManager.uploadDocument(docType, filePath, userAddress);
        } catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    }

    async verifyDocument(userAddress, docType) {
        try {
            const isVerifier = await this.documentsContract.isVerifier(await this.signer.getAddress());
            if (!isVerifier) {
                throw new Error("Not authorized as verifier");
            }
            const tx = await this.documentsContract.verifyDocument(userAddress, this._getDocTypeEnum(docType));
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Error verifying document:', error);
            throw error;
        }
    }

    async revokeDocument(userAddress, docType) {
        try {
            const isVerifier = await this.documentsContract.isVerifier(await this.signer.getAddress());
            if (!isVerifier) {
                throw new Error("Not authorized as verifier");
            }
            const tx = await this.documentsContract.revokeDocument(this._getDocTypeEnum(docType));
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Error revoking document:', error);
            throw error;
        }
    }

    _getDocTypeEnum(docType) {
        const DocumentType = {
            'NIC': 0,
            'BIRTH_CERTIFICATE': 1,
            'PASSPORT': 2
        };
        return DocumentType[docType];
    }
}

const blockchainService = new BlockchainService();
export default blockchainService;
