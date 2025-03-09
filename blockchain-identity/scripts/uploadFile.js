import { create } from '@web3-storage/w3up-client';
import * as fs from 'fs';
import path from 'path';

async function uploadFile(filePath) {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error('❌ File not found:', filePath);
            process.exit(1);
        }

        console.log('🔹 Creating Web3.Storage client...');
        const client = await create();

        // Get the space DID
        const spaceDid = 'did:key:z6Mkhi9HRVD3LGqEG2KuNFgZzC8BVyvcejP4XyHac29dzhA9';
        
        try {
            // Read file and prepare for upload
            const fileContent = await fs.promises.readFile(filePath);
            const fileName = path.basename(filePath);
            const file = new File([fileContent], fileName);

            console.log(`🔹 Uploading ${fileName} to Web3.Storage...`);
            
            // Set current space and upload
            await client.setCurrentSpace(spaceDid);
            const cid = await client.uploadFile(file);

            console.log('✅ Upload complete!');
            console.log(`📝 Content ID: ${cid}`);
            console.log(`🔗 View at: https://w3s.link/ipfs/${cid}`);
            console.log(`🔗 IPFS Gateway: https://ipfs.io/ipfs/${cid}`);

            return cid;
        } catch (uploadError) {
            if (uploadError.message?.includes('not authorized') || uploadError.message?.includes('no proofs')) {
                console.error('❌ Authorization needed!');
                console.error('\n💡 Run this command first:');
                console.error('w3 up test.txt');
                console.error('\nThis will set up your authentication properly.');
            } else {
                console.error('❌ Upload error:', uploadError.message);
            }
            throw uploadError;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the function with a file path argument
if (!process.argv[2]) {
    console.error('❌ Please provide a file path:');
    console.error('node scripts/uploadFile.js path/to/your/file');
    process.exit(1);
}

uploadFile(process.argv[2]);
