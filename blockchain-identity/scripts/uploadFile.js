import { DocumentManager } from '../utils/DocumentManager.js';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Validate command line arguments
    if (process.argv.length !== 4) {
        console.error('Usage: node uploadFile.js <document_type> <file_path>');
        process.exit(1);
    }

    const [, , docType, filePath] = process.argv;

    try {
        // Get wallet address from private key
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const walletAddress = await signer.getAddress();

        console.log('🔹 Initializing document manager...');
        const documentManager = new DocumentManager(
            process.env.DOCUMENTS_CONTRACT || '0xF84098EE1b988D6ddC6ab5864E464A97a15913C5',
            process.env.RPC_URL || 'https://testnet.skalenodes.com/v1/giant-half-dual-testnet'
        );
        await documentManager.initialize();

        console.log(`🔹 Processing ${docType} document for ${walletAddress}...`);
        const result = await documentManager.uploadDocument(docType, filePath, walletAddress);
        
        console.log('\n✅ Document uploaded successfully!');
        console.log('Document Details:');
        console.log('----------------');
        console.log(`Type: ${result.docType}`);
        console.log(`IPFS Hash: ${result.ipfsHash}`);
        console.log(`IPFS URL: ${result.ipfsUrl}`);
        console.log(`Owner: ${result.owner}`);
        console.log(`Timestamp: ${result.timestamp}`);

    } catch (error) {
        console.error('\n❌ Upload failed:', error.message);
        console.log('\n💡 Make sure you have:');
        console.log('1. Added DOCUMENTS_CONTRACT address to .env');
        console.log('2. Added RPC_URL to .env');
        console.log('3. Deployed the IdentityDocuments contract');
        process.exit(1);
    }
}

main();
