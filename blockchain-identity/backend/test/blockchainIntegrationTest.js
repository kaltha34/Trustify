import { BlockchainService } from '../services/blockchainService.js';
import { DocumentManager } from '../../utils/DocumentManager.js';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from both root and backend .env files
dotenv.config(); // Load backend .env
dotenv.config({ path: path.join(__dirname, '../../../.env') }); // Load root .env

async function testBlockchainIntegration() {
    console.log('\n=== Testing Blockchain Integration ===\n');
    console.log('Network:', 'SKALE Testnet (giant-half-dual-testnet)');
    console.log('RPC URL:', process.env.RPC_URL);
    console.log('Verification Contract:', process.env.VERIFICATION_CONTRACT);
    console.log('Documents Contract:', process.env.DOCUMENTS_CONTRACT);
    console.log('Verifier Account:', process.env.VERIFIER_ADDRESS);
    
    let testFile = null;

    try {
        // Step 1: Initialize DocumentManager
        console.log('\n1. Initializing DocumentManager...');
        const documentManager = new DocumentManager();
        await documentManager.initialize();
        console.log('✅ DocumentManager initialized successfully');

        // Step 2: Create test document
        console.log('\n2. Creating test document...');
        const testDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }

        testFile = path.join(testDir, 'test_passport.pdf');
        const content = `Test Passport
------------------
Document Type: PASSPORT
Name: John Doe
Nationality: United States
Passport Number: P123456789
Date of Birth: 1990-01-01
Date of Issue: 2024-01-01
Date of Expiry: 2034-01-01
Issuing Authority: Department of State`;

        fs.writeFileSync(testFile, content);
        console.log('Test file created:', testFile);
        console.log('File size:', fs.statSync(testFile).size, 'bytes');

        // Step 3: Upload document
        console.log('\n3. Uploading document to IPFS and blockchain...');
        const docType = 1; // Use uint8 for document type
        const result = await documentManager.uploadDocument(docType, testFile);
        console.log('\nTransaction Hash:', result.transactionHash);
        console.log('IPFS Hash:', result.ipfsHash);
        console.log('IPFS Gateway URL:', `https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`);

        // Step 4: Get document details
        console.log('\n4. Getting document details...');
        const doc = await documentManager.getDocument(docType);
        console.log('\nDocument Details:');
        console.log('- IPFS Hash:', doc.ipfsHash);
        console.log('- Timestamp:', new Date(doc.timestamp * 1000).toLocaleString());
        console.log('- Valid:', doc.isValid);
        console.log('- Verified:', doc.isVerified);
        console.log('- Verified By:', doc.verifiedBy);

        // Step 5: Test document verification
        console.log('\n5. Testing document verification...');
        const verificationResult = await documentManager.verifyDocument(docType);
        console.log('Verification Transaction Hash:', verificationResult.transactionHash);

        // Step 6: Check updated document details
        console.log('\n6. Checking updated document details...');
        const updatedDoc = await documentManager.getDocument(docType);
        console.log('\nUpdated Document Details:');
        console.log('- IPFS Hash:', updatedDoc.ipfsHash);
        console.log('- Timestamp:', new Date(updatedDoc.timestamp * 1000).toLocaleString());
        console.log('- Valid:', updatedDoc.isValid);
        console.log('- Verified:', updatedDoc.isVerified);
        console.log('- Verified By:', updatedDoc.verifiedBy);

        console.log('\n✅ Blockchain integration test completed successfully!');
        return true;
    } catch (error) {
        console.error('\n❌ Test failed:', {
            name: error.name,
            code: error.code,
            message: error.message
        });

        if (error.details) {
            console.error('\nError Details:', JSON.stringify(error.details, null, 2));
        }

        // Provide helpful suggestions based on error type
        switch (error.code) {
            case 'NETWORK_ERROR':
                console.log('\n💡 Suggestion: Check your network connection:');
                console.log('1. Verify RPC URL is correct');
                console.log('2. Check if SKALE testnet is accessible');
                console.log('3. Try using a different RPC endpoint');
                break;
                
            case 'CONTRACT_ERROR':
                console.log('\n💡 Suggestion: Verify smart contract setup:');
                console.log('1. Check contract addresses in .env');
                console.log('2. Ensure contracts are deployed to SKALE testnet');
                console.log('3. Verify account has proper permissions');
                break;
                
            case 'BALANCE_ERROR':
                console.log('\n💡 Suggestion: Check account balance:');
                console.log('1. Get test sFUEL from SKALE faucet');
                console.log('2. Verify account has sufficient balance');
                break;
                
            case 'AUTH_ERROR':
                console.log('\n💡 Suggestion: Check account permissions:');
                console.log('1. Verify account is registered as verifier');
                console.log('2. Contact contract owner for permissions');
                break;
                
            default:
                console.log('\n💡 Suggestion: General troubleshooting:');
                console.log('1. Check all environment variables');
                console.log('2. Verify contract ABIs are up to date');
                console.log('3. Check transaction parameters');
        }
        
        return false;
    } finally {
        // Clean up
        if (testFile && fs.existsSync(testFile)) {
            try {
                const testDir = path.dirname(testFile);
                fs.unlinkSync(testFile);
                fs.rmdirSync(testDir);
                console.log('\n✅ Test files cleaned up');
            } catch (err) {
                console.error('\n⚠️ Failed to clean up test files:', err.message);
            }
        }
    }
}

// Run the test
testBlockchainIntegration().then(success => {
    process.exit(success ? 0 : 1);
});
