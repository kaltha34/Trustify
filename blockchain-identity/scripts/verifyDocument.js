import { DocumentManager } from '../utils/DocumentManager.js';
import dotenv from 'dotenv';

dotenv.config();

const WALLET_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const DOC_TYPE = 'NIC';

async function verifyDocument() {
    try {
        const manager = new DocumentManager(process.env.DOCUMENTS_CONTRACT, process.env.RPC_URL);
        await manager.initialize();
        
        console.log('🔹 Fetching document details...');
        const doc = await manager.getDocument(WALLET_ADDRESS, DOC_TYPE);
        
        console.log('\nDocument Details:');
        console.log('----------------');
        console.log('IPFS Hash:', doc.ipfsHash);
        console.log('IPFS URL:', doc.ipfsUrl);
        console.log('Timestamp:', new Date(parseInt(doc.timestamp) * 1000).toISOString());
        console.log('Valid:', doc.isValid);
        console.log('Verified:', doc.isVerified);
        console.log('Verified By:', doc.verifiedBy);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

verifyDocument();
