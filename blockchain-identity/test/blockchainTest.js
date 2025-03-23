import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Full contract ABIs with all necessary functions and events
const IDENTITY_VERIFICATION_ABI = [
    "function isVerifier(address _address) external view returns (bool)",
    "function addVerifier(address _verifier) external",
    "function removeVerifier(address _verifier) external",
    "function getUserStatus(address _user) external view returns (bool isRegistered, bool isVerified)",
    "function registerUser() external",
    "event VerifierAdded(address indexed verifier)",
    "event VerifierRemoved(address indexed verifier)",
    "event UserRegistered(address indexed user)"
];

const IDENTITY_DOCUMENTS_ABI = [
    "function uploadDocument(uint8 _docType, string memory _ipfsHash) external",
    "function getDocument(address _user, uint8 _docType) external view returns (string memory ipfsHash, uint256 timestamp, bool isValid, bool isVerified, address verifiedBy)",
    "function hasValidDocument(address _user, uint8 _docType) external view returns (bool)",
    "function verifyDocument(address _user, uint8 _docType) external",
    "function revokeDocument(uint8 _docType) external",
    "function isVerifier(address _address) external view returns (bool)",
    "event DocumentUploaded(address indexed user, uint8 indexed docType, string ipfsHash)",
    "event DocumentVerified(address indexed user, uint8 indexed docType, address indexed verifier)",
    "event DocumentRevoked(address indexed user, uint8 indexed docType)"
];

const VERIFICATION_ABI = [
    "function owner() public view returns (address)",
    "function isVerifier(address _address) public view returns (bool)",
    "function addVerifier(address _verifier) external"
];

async function testBlockchainConnection() {
    try {
        // Initialize provider and wallet
        const provider = new ethers.JsonRpcProvider("https://testnet.skalenodes.com/v1/giant-half-dual-testnet");
        const wallet = new ethers.Wallet("928d43e8f9d617079114972f8fbbc8e900b205dc8f92311c1e2c753e976121c6", provider);
        console.log('Wallet address:', wallet.address);

        // Initialize contracts
        const verificationContract = new ethers.Contract(
            "0x123676956F35d9791bf3d679a9f0E0f293427a35",
            IDENTITY_VERIFICATION_ABI,
            wallet
        );
        
        const documentsContract = new ethers.Contract(
            "0xF84098EE1b988D6ddC6ab5864E464A97a15913C5",
            IDENTITY_DOCUMENTS_ABI,
            wallet
        );

        // 1. Test user registration status
        console.log('\n1. Testing user registration status...');
        try {
            const userStatus = await verificationContract.getUserStatus(wallet.address);
            console.log('User status:', {
                isRegistered: userStatus.isRegistered,
                isVerified: userStatus.isVerified
            });

            if (!userStatus.isRegistered) {
                console.log('Registering user...');
                const tx = await verificationContract.registerUser();
                await tx.wait();
                console.log('User registered successfully!');
            }
        } catch (error) {
            console.error('Error checking/registering user:', error.message);
        }

        // 2. Test verifier status
        console.log('\n2. Testing verifier status...');
        try {
            const isVerifier = await documentsContract.isVerifier(wallet.address);
            console.log('Is wallet a verifier?', isVerifier);
        } catch (error) {
            console.error('Error checking verifier status:', error.message);
        }

        // 3. Test document status for each type
        console.log('\n3. Testing document status for each type...');
        const documentTypes = [0, 1, 2]; // NIC, BIRTH_CERTIFICATE, PASSPORT
        const typeNames = ['NIC', 'BIRTH_CERTIFICATE', 'PASSPORT'];
        
        for (let i = 0; i < documentTypes.length; i++) {
            try {
                const hasValid = await documentsContract.hasValidDocument(wallet.address, documentTypes[i]);
                console.log(`\nDocument type: ${typeNames[i]}`);
                console.log('Has valid document:', hasValid);

                if (hasValid) {
                    const doc = await documentsContract.getDocument(wallet.address, documentTypes[i]);
                    console.log('Document details:', {
                        ipfsHash: doc.ipfsHash,
                        timestamp: Number(doc.timestamp).toString(),
                        isValid: doc.isValid,
                        isVerified: doc.isVerified,
                        verifiedBy: doc.verifiedBy
                    });
                }
            } catch (error) {
                console.log(`Error checking ${typeNames[i]} document:`, error.message);
            }
        }

        console.log('\nAll blockchain connection tests completed!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

async function testVerifierSetup() {
    try {
        const provider = new ethers.JsonRpcProvider("https://testnet.skalenodes.com/v1/giant-half-dual-testnet");
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const signerAddress = await signer.getAddress();
        
        console.log('Testing with address:', signerAddress);

        const verificationContract = new ethers.Contract(
            "0x123676956F35d9791bf3d679a9f0E0f293427a35",
            VERIFICATION_ABI,
            signer
        );

        // Check contract owner
        const owner = await verificationContract.owner();
        console.log('Contract owner:', owner);
        console.log('Is our address the owner?', owner.toLowerCase() === signerAddress.toLowerCase());

        // Check if we're a verifier
        const isVerifier = await verificationContract.isVerifier(signerAddress);
        console.log('Is our address a verifier?', isVerifier);

        // If we're the owner but not a verifier, add ourselves as a verifier
        if (owner.toLowerCase() === signerAddress.toLowerCase() && !isVerifier) {
            console.log('Adding ourselves as a verifier...');
            const tx = await verificationContract.addVerifier(signerAddress);
            await tx.wait();
            console.log('Successfully added as verifier');
        }
    } catch (error) {
        console.error('Verifier setup test failed:', error);
    }
}

testBlockchainConnection();
testVerifierSetup();
