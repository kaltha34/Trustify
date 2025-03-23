import { BlockchainService } from '../services/blockchainService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testDocumentUpload() {
    console.log('\n=== Starting Document Upload Test ===');

    // Check environment variables
    console.log('Environment Check:');
    const requiredEnvVars = [
        'RPC_URL',
        'PRIVATE_KEY',
        'VERIFICATION_CONTRACT',
        'DOCUMENTS_CONTRACT'
    ];

    for (const varName of requiredEnvVars) {
        if (!process.env[varName]) {
            console.error(`❌ ${varName} not found in environment variables`);
            process.exit(1);
        }
        console.log(`- ${varName}: ✓`);
    }

    try {
        // Initialize blockchain service
        console.log('\n1. Initializing blockchain service...');
        const blockchainService = new BlockchainService();
        await blockchainService.initialize();

        // Test document upload
        console.log('\n2. Testing document upload...');
        const userAddress = blockchainService.web3.eth.defaultAccount;
        console.log('User address:', userAddress);

        const result = await blockchainService.uploadDocument(
            0, // NIC
            'test.pdf',
            userAddress
        );

        console.log('\nUpload Result:', {
            success: result.success,
            transactionHash: result.transactionHash,
            ipfsHash: result.ipfsHash
        });

        // Check document status
        console.log('\n3. Checking document status...');
        const status = await blockchainService.getDocumentStatus(userAddress, 0);
        console.log('Document Status:', status);

        console.log('\n✅ Test completed successfully');
        return true;
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        return false;
    }
}

// Run the test
testDocumentUpload().then(success => {
    process.exit(success ? 0 : 1);
});
