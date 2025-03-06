const { Web3Storage, getFilesFromPath } = require('web3.storage');
require('dotenv').config();

async function uploadFile(filePath) {
    const client = new Web3Storage({ token: process.env.WEB3_STORAGE_API_KEY });

    console.log("🔹 Uploading file to Web3.Storage...");
    const files = await getFilesFromPath(filePath);
    const cid = await client.put(files);
    
    console.log(`✅ File uploaded successfully! CID: ${cid}`);
    return cid;
}

// Run the function with a file path argument
uploadFile(process.argv[2]).catch(console.error);
