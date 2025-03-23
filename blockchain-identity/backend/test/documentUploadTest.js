import { DocumentManager } from '../../utils/DocumentManager.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create test document
async function createTestDocument() {
    const testDir = path.join(__dirname, '../test-files');
    const testFilePath = path.join(testDir, 'test-passport.pdf');

    // Ensure test directory exists
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }

    // Create test document content
    const content = `SAMPLE PASSPORT
------------------
Document Type: PASSPORT
Name: John Doe
Nationality: United States
Passport Number: P123456789
Date of Birth: 1990-01-01
Date of Issue: 2024-01-01
Date of Expiry: 2034-01-01
Issuing Authority: Department of State
`;

    // Write test document
    fs.writeFileSync(testFilePath, content);
    return testFilePath;
}

async function runTest() {
    console.log('\n=== Testing Document Upload Flow ===\n');
    
    const documentManager = new DocumentManager();
    let error = null;
    let testFilePath = null;

    try {
        // Step 1: Initialize DocumentManager
        console.log('1. Initializing DocumentManager...\n');
        await documentManager.initialize();
        console.log('\n✅ DocumentManager initialized successfully');

        // Step 2: Create test document
        console.log('\n2. Creating test document...');
        testFilePath = await createTestDocument();
        console.log('✅ Test document created:', testFilePath);

        // Step 3: Upload test document
        console.log('\n3. Uploading test document...');
        const docType = 'PASSPORT';
        const result = await documentManager.uploadDocument(docType, testFilePath);
        
        console.log('\n✅ Document upload successful');
        console.log('Transaction Hash:', result.transactionHash);
        
        // Step 4: Verify document status
        console.log('\n4. Verifying document status...');
        const docStatus = await documentManager.getDocumentStatus(docType);
        
        console.log('\nDocument Status:');
        console.log('- IPFS Hash:', docStatus.ipfsHash);
        console.log('- Timestamp:', new Date(docStatus.timestamp * 1000).toLocaleString());
        console.log('- Valid:', docStatus.isValid);
        console.log('- Verified:', docStatus.isVerified);
        console.log('- Verified By:', docStatus.verifiedBy);
        
    } catch (err) {
        error = err;
        console.error('\n❌ Test failed with error:', {
            name: err.name,
            code: err.code,
            message: err.message,
            details: err.details || err.stack
        });

        // Provide helpful suggestions based on error type
        switch (err.code) {
            case 'CONFIG_ERROR':
                console.log('\n💡 Suggestion: Check your .env file and ensure all required variables are set:');
                console.log('- RPC_URL');
                console.log('- PRIVATE_KEY');
                console.log('- VERIFICATION_CONTRACT');
                console.log('- DOCUMENTS_CONTRACT');
                console.log('- PINATA_API_KEY');
                console.log('- PINATA_API_SECRET');
                break;
                
            case 'NETWORK_ERROR':
                console.log('\n💡 Suggestion: Check your network connection and RPC URL:');
                console.log('- Verify that the SKALE testnet is accessible');
                console.log('- Try using a different RPC endpoint');
                console.log('- Check if your IP is allowed to access the network');
                break;
                
            case 'BALANCE_ERROR':
                console.log('\n💡 Suggestion: Your account needs sFUEL to perform transactions:');
                console.log('- Visit the SKALE faucet to get test sFUEL');
                console.log('- Make sure you\'re using the correct account address');
                break;
                
            case 'CONTRACT_ERROR':
                console.log('\n💡 Suggestion: Verify your smart contract deployment:');
                console.log('- Check if the contract addresses in .env are correct');
                console.log('- Ensure the contracts are deployed to the SKALE testnet');
                console.log('- Verify that the contract ABIs match the deployed contracts');
                break;
                
            case 'AUTH_ERROR':
                console.log('\n💡 Suggestion: Check your account permissions:');
                console.log('- Ensure your account is registered as a verifier');
                console.log('- Contact the contract owner to grant necessary permissions');
                break;
                
            case 'INVALID_DOC_TYPE':
                console.log('\n💡 Suggestion: Use one of the supported document types:');
                console.log('- PASSPORT');
                console.log('- NIC');
                console.log('- BIRTH_CERTIFICATE');
                break;
                
            default:
                if (err.message.includes('gas')) {
                    console.log('\n💡 Suggestion: Transaction may have failed due to gas issues:');
                    console.log('- Check if you have enough sFUEL');
                    console.log('- Try increasing the gas limit');
                } else {
                    console.log('\n💡 Suggestion: General troubleshooting steps:');
                    console.log('- Check your network connection');
                    console.log('- Verify your environment configuration');
                    console.log('- Ensure all contract requirements are met');
                }
        }
    } finally {
        // Clean up test file
        if (testFilePath && fs.existsSync(testFilePath)) {
            try {
                fs.unlinkSync(testFilePath);
                console.log('\n✅ Test file cleaned up');
            } catch (err) {
                console.error('\n⚠️ Failed to clean up test file:', err.message);
            }
        }
    }

    // Exit with appropriate code
    process.exit(error ? 1 : 0);
}

// Run the test
runTest();
