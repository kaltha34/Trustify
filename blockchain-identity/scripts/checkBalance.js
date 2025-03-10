import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

async function checkBalance() {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const walletAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
        
        console.log('🔹 Checking wallet balance...');
        const balance = await provider.getBalance(walletAddress);
        console.log(`\nWallet Address: ${walletAddress}`);
        console.log(`Balance: ${ethers.formatEther(balance)} SKALE`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkBalance();
