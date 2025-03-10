import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const IDENTITY_DOCUMENTS_ABI = [
    "function uploadDocument(uint8 _docType, string memory _ipfsHash) public",
    "function getDocument(address _user, uint8 _docType) public view returns (string memory ipfsHash, uint256 timestamp, bool isValid, bool isVerified, address verifiedBy)",
    "function hasValidDocument(address _user, uint8 _docType) public view returns (bool)",
    "function owner() public view returns (address)"
];

async function checkContract() {
    try {
        console.log('🔹 Connecting to SKALE testnet...');
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const walletAddress = await signer.getAddress();
        console.log('Wallet address:', walletAddress);
        
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
        
        // Check contract owner
        console.log('\n🔹 Checking contract owner...');
        const owner = await contract.owner();
        console.log('Contract owner:', owner);
        console.log('Is wallet owner?', owner.toLowerCase() === walletAddress.toLowerCase());
        
        // Check wallet balance
        const balance = await provider.getBalance(walletAddress);
        console.log('\nWallet Balance:', ethers.formatEther(balance), 'SKALE');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkContract();
