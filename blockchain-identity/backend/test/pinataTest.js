const { PinataService } = require('../services/pinataService');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from both root and backend .env files
dotenv.config(); // Load backend .env
dotenv.config({ path: path.join(__dirname, '../../.env') }); // Load root .env

async function testPinataUpload() {
    console.log('\n=== Testing Pinata IPFS Integration ===\n');
    console.log('Using Pinata API Key:', process.env.PINATA_API_KEY);
    let testFile = null;
    
    try {
        // Initialize Pinata service
        console.log('\n1. Initializing Pinata service...');
        const pinata = new PinataService();
        await pinata.initialize();

        // Create a test file
        console.log('\n2. Creating test document...');
        const testDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }

        testFile = path.join(testDir, 'test_document.txt');
        const content = `Test Document
------------------
Created: ${new Date().toISOString()}
Type: Test File
Owner: 0x8460A580aD58539128b9d068FbCd07876a501b41
Purpose: Pinata IPFS Upload Test`;

        fs.writeFileSync(testFile, content);
        console.log('Test file created:', testFile);
        console.log('File size:', fs.statSync(testFile).size, 'bytes');

        // Upload test file
        console.log('\n3. Uploading test file to IPFS...');
        const ipfsHash = await pinata.uploadFile(testFile);
        console.log('\nIPFS Hash:', ipfsHash);
        console.log('IPFS Gateway URL:', `https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

        // Test unpinning
        console.log('\n4. Testing unpin functionality...');
        await pinata.unpinFile(ipfsHash);

        console.log('\n✅ Test completed successfully!');
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
            case 'CONFIG_ERROR':
                console.log('\n💡 Suggestion: Check your environment variables:');
                console.log('Current API Key:', process.env.PINATA_API_KEY);
                console.log('Current API Secret:', process.env.PINATA_API_SECRET ? '***[hidden]***' : 'Not set');
                break;
                
            case 'AUTH_ERROR':
                console.log('\n💡 Suggestion: Verify your Pinata API credentials:');
                console.log('1. Go to https://app.pinata.cloud/');
                console.log('2. Sign in to your account');
                console.log('3. Click on "API Keys"');
                console.log('4. Verify or create new API keys');
                console.log('5. Update your .env files with the new keys');
                break;
                
            case 'UPLOAD_ERROR':
                console.log('\n💡 Suggestion: Check the file and try again:');
                console.log('1. Ensure the file exists and is readable');
                console.log('2. Check if the file size is within limits');
                console.log('3. Verify your network connection');
                break;
                
            default:
                console.log('\n💡 Suggestion: General troubleshooting:');
                console.log('1. Check your network connection');
                console.log('2. Verify Pinata service status');
                console.log('3. Try with a smaller test file');
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
testPinataUpload().then(success => {
    process.exit(success ? 0 : 1);
});
