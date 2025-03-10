import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

async function checkWallet() {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const walletAddress = await signer.getAddress();
        
        console.log('🔹 Checking wallet details...');
        console.log('\nWallet Address:', walletAddress);
        const balance = await provider.getBalance(walletAddress);
        console.log('Balance:', ethers.formatEther(balance), 'SKALE');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkWallet();
