import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const IDENTITY_DOCUMENTS_ABI = [
    "function uploadDocument(uint8 _docType, string memory _ipfsHash) public",
    "function getDocument(address _user, uint8 _docType) public view returns (string memory ipfsHash, uint256 timestamp, bool isValid, bool isVerified, address verifiedBy)",
    "function hasValidDocument(address _user, uint8 _docType) public view returns (bool)"
];

async function checkContractState() {
    try {
        console.log('🔹 Connecting to SKALE testnet...');
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        const contractAddress = '0xF84098EE1b988D6ddC6ab5864E464A97a15913C5';
        console.log('Contract address:', contractAddress);
        
        const contract = new ethers.Contract(contractAddress, IDENTITY_DOCUMENTS_ABI, signer);
        
        // Check if contract is accessible
        console.log('\n🔹 Checking contract deployment...');
        const code = await provider.getCode(contractAddress);
        if (code === '0x') {
            throw new Error('Contract not found at the specified address');
        }
        console.log('✅ Contract is deployed and accessible');
        
        // Check document for our wallet
        const walletAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
        console.log('\n🔹 Checking NIC document for wallet:', walletAddress);
        const doc = await contract.getDocument(walletAddress, 0); // 0 is NIC
        
        console.log('\nDocument Details:');
        console.log('----------------');
        console.log('IPFS Hash:', doc.ipfsHash);
        console.log('Timestamp:', doc.timestamp.toString());
        console.log('Valid:', doc.isValid);
        console.log('Verified:', doc.isVerified);
        console.log('Verified By:', doc.verifiedBy);
        
        // Check wallet balance
        const balance = await provider.getBalance(walletAddress);
        console.log('\nWallet Balance:', ethers.formatEther(balance), 'SKALE');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkContractState();
