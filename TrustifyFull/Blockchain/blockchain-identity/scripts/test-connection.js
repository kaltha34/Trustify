import { ethers } from 'ethers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend .env
dotenv.config({ path: path.join(__dirname, '../../backend/.env') });

async function main() {
    try {
        console.log('Testing SKALE network connection...');
        
        const rpcUrl = process.env.SKALE_RPC_URL;
        console.log('RPC URL:', rpcUrl);
        
        if (!rpcUrl) {
            throw new Error('SKALE_RPC_URL not found in environment variables');
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
            timeout: 30000,
            staticNetwork: true,
            polling: true,
            pollingInterval: 1000
        });

        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log('Wallet address:', await wallet.getAddress());

        // Try to get balance
        try {
            const balance = await wallet.getBalance();
            console.log('Balance:', ethers.formatEther(balance), 'sFUEL');
        } catch (error) {
            console.error('Failed to get balance:', error.message);
        }

        // Try to get network info
        try {
            const network = await provider.getNetwork();
            console.log('Connected to network:', {
                name: network.name,
                chainId: Number(network.chainId)
            });
        } catch (error) {
            console.error('Failed to get network info:', error.message);
        }

        // Try to get block
        try {
            const block = await provider.getBlock('latest');
            console.log('Latest block:', block?.number);
        } catch (error) {
            console.error('Failed to get latest block:', error.message);
        }

        // Try to access the verification contract
        try {
            const verificationAddress = process.env.VERIFICATION_CONTRACT_ADDRESS;
            console.log('Verification contract address:', verificationAddress);

            const verificationContract = new ethers.Contract(
                verificationAddress,
                ["function admin() external view returns (address)"],
                wallet
            );

            const admin = await verificationContract.admin();
            console.log('Contract admin:', admin);
            console.log('Connection test successful!');
        } catch (error) {
            console.error('Failed to call contract:', error.message);
        }
    } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
    }
}

main().catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
});
