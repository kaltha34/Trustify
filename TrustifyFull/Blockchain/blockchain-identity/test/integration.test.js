import { expect } from 'chai';
import pkg from 'hardhat';
const { ethers } = pkg;
import { BlockchainService } from '../records backend/services/blockchainService.js';
import fs from 'fs';

describe('Trustify Integration Tests', function () {
    let identityVerification;
    let identityDocuments;
    let owner;
    let user1;
    let verifier;
    let blockchainService;

    before(async function () {
        process.env.NODE_ENV = 'test';

        // Get signers
        [owner, user1, verifier] = await ethers.getSigners();
        console.log("Wallet address:", owner.address);

        // Deploy contracts
        const IdentityVerification = await ethers.getContractFactory('IdentityVerification');
        identityVerification = await IdentityVerification.deploy();
        const verificationAddress = await identityVerification.getAddress();

        const IdentityDocuments = await ethers.getContractFactory('IdentityDocuments');
        identityDocuments = await IdentityDocuments.deploy();
        const documentsAddress = await identityDocuments.getAddress();

        console.log('Deployed Contracts:');
        console.log('IdentityVerification:', verificationAddress);
        console.log('IdentityDocuments:', documentsAddress);

        // Initialize BlockchainService with contract addresses and hardhat signer
        blockchainService = new BlockchainService(null, null, owner);
        blockchainService.setContracts(verificationAddress, documentsAddress);
        await blockchainService.initialize();

        // Create test files
        const testFiles = ['testDoc.txt', 'testDoc1.txt', 'testDoc2.txt'];
        testFiles.forEach(file => {
            const filePath = `./test/${file}`;
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, `Test content for ${file}`);
            }
        });
    });

    describe('User Registration and Document Management', function () {
        it('should check user registration status', async function () {
            console.log('\n1. Testing user registration status...');
            console.log("Wallet address:", owner.address);

            // Add user first
            await identityVerification.addUser(owner.address);
            const isRegistered = await identityVerification.users(owner.address);
            expect(isRegistered).to.equal(true);
            console.log('User registered successfully');
        });

        it('should upload and verify a document', async function () {
            console.log('\n1. Uploading test NIC document...');
            
            const docType = 1; // NIC
            const testMetadata = {
                name: 'Test NIC',
                documentType: 'National ID Card',
                issuer: 'Government'
            };

            // Create a test file
            const testFilePath = './test/testDoc.txt';
            const expiryDate = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // 1 year from now

            try {
                // Upload document
                const uploadResult = await blockchainService.uploadDocument(
                    docType,
                    testFilePath,
                    expiryDate,
                    testMetadata
                );

                expect(uploadResult.success).to.equal(true);
                expect(uploadResult.ipfsHash).to.be.a('string');
                console.log('Document uploaded with IPFS hash:', uploadResult.ipfsHash);

                // Get document
                const document = await blockchainService.getDocument(owner.address, docType);
                expect(document.ipfsHash).to.equal(uploadResult.ipfsHash);
                expect(document.isValid).to.equal(true);
                expect(document.isVerified).to.equal(false);
                console.log('Document retrieved successfully');

                // Request verification
                const verificationRequest = await blockchainService.requestVerification(uploadResult.ipfsHash);
                expect(verificationRequest.success).to.equal(true);
                console.log('Verification requested');

                // Add verifier if not already added
                const isVerifierStatus = await identityVerification.verifiers(verifier.address);
                if (!isVerifierStatus) {
                    await identityVerification.addVerifier(verifier.address);
                    console.log('Verifier added:', verifier.address);
                } else {
                    console.log('Verifier already exists:', verifier.address);
                }

                // Switch to verifier signer
                const verifierBlockchainService = new BlockchainService(null, null, verifier);
                verifierBlockchainService.setContracts(
                    await identityVerification.getAddress(),
                    await identityDocuments.getAddress()
                );

                // Verify document
                const verificationResult = await verifierBlockchainService.addVerificationSignature(uploadResult.ipfsHash);
                expect(verificationResult.success).to.equal(true);
                console.log('Document verified');
                
                // Check verification status
                const verificationCount = await identityVerification.getVerificationSignatureCount(uploadResult.ipfsHash);
                expect(verificationCount).to.be.above(0);
                console.log('Verification count:', verificationCount.toString());
            } catch (error) {
                console.error('Test failed:', error);
                throw error;
            }
        });

        it('should handle batch document uploads', async function () {
            console.log('\n1. Testing batch document uploads...');
            const documents = [
                {
                    docType: 2,
                    filePath: './test/testDoc1.txt',
                    expiryDate: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
                    metadata: {
                        name: 'Test Doc 1',
                        documentType: 'Passport',
                        issuer: 'Government'
                    }
                },
                {
                    docType: 3,
                    filePath: './test/testDoc2.txt',
                    expiryDate: Math.floor(Date.now() / 1000) + 180 * 24 * 60 * 60,
                    metadata: {
                        name: 'Test Doc 2',
                        documentType: 'Driver License',
                        issuer: 'Transport Authority'
                    }
                }
            ];

            try {
                const result = await blockchainService.batchUploadDocuments(documents);
                expect(result.success).to.equal(true);
                expect(result.documents).to.have.lengthOf(2);
                console.log('Batch upload successful');

                // Verify each document was uploaded
                for (let i = 0; i < result.documents.length; i++) {
                    const doc = await blockchainService.getDocument(owner.address, documents[i].docType);
                    expect(doc.ipfsHash).to.equal(result.documents[i].ipfsHash);
                    expect(doc.isValid).to.equal(true);
                    console.log(`Document ${i + 1} verified:`, doc.ipfsHash);
                }
            } catch (error) {
                console.error('Test failed:', error);
                throw error;
            }
        });
    });

    after(async function() {
        // Clean up test files
        const testFiles = ['testDoc.txt', 'testDoc1.txt', 'testDoc2.txt'];
        testFiles.forEach(file => {
            const filePath = `./test/${file}`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    });
});
