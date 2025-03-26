import { ethers } from 'ethers';

const IDENTITY_DOCUMENTS_ABI = [
    "function uploadDocument(uint8 _docType, string memory _ipfsHash) external",
    "function getDocument(address _user, uint8 _docType) external view returns (string memory ipfsHash, uint256 timestamp, bool isValid, bool isVerified, address verifiedBy)",
    "function hasValidDocument(address _user, uint8 _docType) external view returns (bool)",
    "function verifyDocument(address _user, uint8 _docType) external",
    "function revokeDocument(uint8 _docType) external",
    "function isVerifier(address _address) external view returns (bool)"
];

async function testDocumentOperations() {
    try {
        // Initialize provider and wallet
        const provider = new ethers.JsonRpcProvider("https://testnet.skalenodes.com/v1/giant-half-dual-testnet");
        const wallet = new ethers.Wallet("928d43e8f9d617079114972f8fbbc8e900b205dc8f92311c1e2c753e976121c6", provider);
        console.log('Wallet address:', wallet.address);

        // Initialize contract
        const documentsContract = new ethers.Contract(
            "0xF84098EE1b988D6ddC6ab5864E464A97a15913C5",
            IDENTITY_DOCUMENTS_ABI,
            wallet
        );

        // 1. Upload a test document (NIC)
        console.log('\n1. Uploading test NIC document...');
        try {
            const testIpfsHash = "QmTest123"; // Test IPFS hash
            const tx = await documentsContract.uploadDocument(0, testIpfsHash);
            await tx.wait();
            console.log('Document uploaded successfully!');
        } catch (error) {
            console.error('Error uploading document:', error.message);
        }

        // 2. Check document status
        console.log('\n2. Checking document status...');
        try {
            const doc = await documentsContract.getDocument(wallet.address, 0);
            console.log('Document details:', {
                ipfsHash: doc.ipfsHash,
                timestamp: Number(doc.timestamp).toString(),
                isValid: doc.isValid,
                isVerified: doc.isVerified,
                verifiedBy: doc.verifiedBy
            });
        } catch (error) {
            console.error('Error checking document:', error.message);
        }

        // 3. Verify the document
        console.log('\n3. Verifying document...');
        try {
            const tx = await documentsContract.verifyDocument(wallet.address, 0);
            await tx.wait();
            console.log('Document verified successfully!');
        } catch (error) {
            console.error('Error verifying document:', error.message);
        }

        // 4. Check final document status
        console.log('\n4. Checking final document status...');
        try {
            const doc = await documentsContract.getDocument(wallet.address, 0);
            console.log('Final document details:', {
                ipfsHash: doc.ipfsHash,
                timestamp: Number(doc.timestamp).toString(),
                isValid: doc.isValid,
                isVerified: doc.isVerified,
                verifiedBy: doc.verifiedBy
            });
        } catch (error) {
            console.error('Error checking final status:', error.message);
        }

        console.log('\nDocument operations test completed!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testDocumentOperations();
