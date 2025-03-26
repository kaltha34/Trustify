import { ethers } from 'ethers';

const IDENTITY_DOCUMENTS_ABI = [
    "function uploadDocument(uint8 _docType, string memory _ipfsHash) external",
    "function getDocument(address _user, uint8 _docType) external view returns (string memory ipfsHash, uint256 timestamp, bool isValid, bool isVerified, address verifiedBy)",
    "function hasValidDocument(address _user, uint8 _docType) external view returns (bool)",
    "function verifyDocument(address _user, uint8 _docType) external",
    "function revokeDocument(uint8 _docType) external",
    "function isVerifier(address _address) external view returns (bool)"
];

async function testRevocation() {
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

        // 1. Check initial document status
        console.log('\n1. Checking initial document status...');
        try {
            const doc = await documentsContract.getDocument(wallet.address, 0); // Check NIC document
            console.log('Initial document status:', {
                ipfsHash: doc.ipfsHash,
                timestamp: Number(doc.timestamp).toString(),
                isValid: doc.isValid,
                isVerified: doc.isVerified,
                verifiedBy: doc.verifiedBy
            });
        } catch (error) {
            console.error('Error checking initial status:', error.message);
            return;
        }

        // 2. Revoke the document
        console.log('\n2. Revoking document...');
        try {
            const tx = await documentsContract.revokeDocument(0); // Revoke NIC document
            await tx.wait();
            console.log('Document revoked successfully!');
        } catch (error) {
            console.error('Error revoking document:', error.message);
            return;
        }

        // 3. Check final document status
        console.log('\n3. Checking final document status...');
        try {
            const doc = await documentsContract.getDocument(wallet.address, 0);
            console.log('Final document status:', {
                ipfsHash: doc.ipfsHash,
                timestamp: Number(doc.timestamp).toString(),
                isValid: doc.isValid,
                isVerified: doc.isVerified,
                verifiedBy: doc.verifiedBy
            });

            // Verify document is no longer valid
            const hasValid = await documentsContract.hasValidDocument(wallet.address, 0);
            console.log('Has valid document:', hasValid);
        } catch (error) {
            console.error('Error checking final status:', error.message);
            return;
        }

        console.log('\nRevocation test completed!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testRevocation();
