import { Web3Storage, File } from 'web3.storage';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

function getWeb3Client() {
    return new Web3Storage({ token: process.env.WEB3_STORAGE_API_KEY });
}

async function uploadFile(filePath) {
    const client = getWeb3Client();
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const file = new File([fileBuffer], fileName, { type: 'application/octet-stream' });

    console.log("🔹 Uploading file to Web3.Storage...");
    
    // Upload file
    const cid = await client.put([file]);

    console.log(`✅ File uploaded successfully! CID: ${cid}`);
    console.log(`🔗 View file: https://w3s.link/ipfs/${cid}`);
    return cid;
}

// Run with file path from command line
const filePath = process.argv[2];
if (!filePath) {
    console.error("❌ Error: Please provide a file path.");
    process.exit(1);
}

uploadFile(filePath).catch(console.error);
