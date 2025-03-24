import { UserService } from '../records backend/services/userService.js';
import { BlockchainService } from '../records backend/services/blockchainService.js';
import { ethers } from 'ethers';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Initialize services
const blockchainService = new BlockchainService(
    process.env.SKALE_RPC_URL,
    process.env.PRIVATE_KEY
);
blockchainService.setContracts(
    process.env.VERIFICATION_CONTRACT_ADDRESS,
    process.env.DOCUMENTS_CONTRACT_ADDRESS
);

const userService = new UserService();

async function test() {
    try {
        await blockchainService.initialize();
        console.log('Blockchain service initialized');

        // 1. Register a new user
        console.log('\n1. Registering new user...');
        const user1 = await userService.registerUser('john.doe', 'john@example.com');
        console.log('User registered:', user1);
        console.log('Wallet address:', user1.walletAddress);

        // 2. Register another user (future admin)
        console.log('\n2. Registering admin user...');
        const admin = await userService.registerUser('admin.user', 'admin@example.com');
        console.log('Admin registered:', admin);

        // 3. Make the second user an admin
        console.log('\n3. Making second user an admin...');
        const superAdminWallet = new ethers.Wallet(process.env.PRIVATE_KEY, blockchainService.provider);
        const verificationContract = new ethers.Contract(
            process.env.VERIFICATION_CONTRACT_ADDRESS,
            ["function addVerifier(address verifier) external"],
            superAdminWallet
        );
        await verificationContract.addVerifier(admin.walletAddress);
        console.log('Admin role assigned to:', admin.walletAddress);

        // 4. Create a test document
        console.log('\n4. Creating test document...');
        const testDoc = 'test-doc.txt';
        fs.writeFileSync(testDoc, 'Test document content');

        // 5. Upload document as user1
        console.log('\n5. Uploading document...');
        const user1Wallet = new ethers.Wallet(user1.privateKey, blockchainService.provider);
        const uploadResult = await blockchainService.uploadDocument(
            1, // docType = NIC
            testDoc,
            Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year expiry
            { name: 'Test NIC', type: 'identification' },
            { wallet: user1Wallet }
        );
        console.log('Document uploaded:', uploadResult);

        // 6. Verify document as admin
        console.log('\n6. Verifying document...');
        const adminWallet = new ethers.Wallet(admin.privateKey, blockchainService.provider);
        const verificationResult = await blockchainService.verifyDocument(
            uploadResult.ipfsHash,
            adminWallet
        );
        console.log('Document verified:', verificationResult);

        // 7. Get user documents and check status
        console.log('\n7. Getting user documents...');
        const documents = await blockchainService.getUserDocuments(user1.walletAddress);
        console.log('User documents:', documents);

        // Clean up
        fs.unlinkSync(testDoc);
        console.log('\nTest completed successfully!');

    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
await test();
