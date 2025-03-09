import { DocumentManager } from '../utils/DocumentManager.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Document types supported by the system
const DOCUMENT_TYPES = {
    NIC: 'NIC',
    BIRTH_CERT: 'BIRTH_CERTIFICATE',
    PASSPORT: 'PASSPORT'
};

async function uploadIdentityDocument(docType, filePath, walletAddress) {
    try {
        // Check required environment variables
        if (!process.env.DOCUMENTS_CONTRACT) {
            throw new Error('DOCUMENTS_CONTRACT address not found in .env file');
        }
        if (!process.env.RPC_URL) {
            throw new Error('RPC_URL not found in .env file');
        }

        // Initialize document manager
        console.log('🔹 Initializing document manager...');
        const documentManager = new DocumentManager(
            process.env.DOCUMENTS_CONTRACT,
            process.env.RPC_URL
        );
        await documentManager.initialize();

        // Upload document
        console.log(`🔹 Processing ${docType} document for ${walletAddress}...`);
        const result = await documentManager.uploadDocument(docType, filePath, walletAddress);

        // Verify upload
        console.log('🔹 Verifying document upload...');
        const isValid = await documentManager.verifyDocument(walletAddress, docType);
        
        if (isValid) {
            console.log('\n✅ Document verified successfully!');
            console.log('\n📝 Document details:');
            console.log(JSON.stringify(result, null, 2));
            
            console.log('\n💡 Access your document:');
            console.log(`Document IPFS URL: ${result.ipfsUrl}`);
            console.log(`Metadata: ${result.ipfsUrl}/metadata.json`);
        } else {
            throw new Error('Document verification failed');
        }

        return result;

    } catch (error) {
        if (error.message?.includes('not authorized')) {
            console.error('❌ Web3.Storage authorization needed!');
            console.error('\n💡 Run these commands first:');
            console.error('1. w3 login kalhara.s.thabrew@gmail.com');
            console.error('2. w3 space create trustify');
            console.error('3. Update the spaceDid in DocumentManager.js');
        } else {
            console.error('❌ Upload failed:', error.message);
            console.error('\n💡 Make sure you have:');
            console.error('1. Added DOCUMENTS_CONTRACT address to .env');
            console.error('2. Added RPC_URL to .env');
            console.error('3. Deployed the IdentityDocuments contract');
        }
        process.exit(1);
    }
}

// Check command line arguments
if (process.argv.length < 5) {
    console.error('❌ Please provide all required arguments:');
    console.error('node scripts/uploadFile.js <document_type> <file_path> <wallet_address>');
    console.error('\nSupported document types:', Object.keys(DOCUMENT_TYPES).join(', '));
    process.exit(1);
}

const [,, docType, filePath, walletAddress] = process.argv;

// Validate document type
if (!DOCUMENT_TYPES[docType]) {
    console.error('❌ Invalid document type');
    console.error('Supported types:', Object.keys(DOCUMENT_TYPES).join(', '));
    process.exit(1);
}

uploadIdentityDocument(DOCUMENT_TYPES[docType], filePath, walletAddress);
