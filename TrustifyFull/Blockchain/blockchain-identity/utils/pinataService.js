import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const PINATA_API_URL = 'https://api.pinata.cloud';

export async function pinFileToIPFS(fileContent, metadata) {
    try {
        const formData = new FormData();
        
        // Append the file buffer with a filename
        formData.append('file', fileContent, {
            filename: metadata.name || 'document.txt'
        });

        // Append metadata
        const pinataMetadata = JSON.stringify({
            name: metadata.name,
            keyvalues: metadata.keyvalues
        });
        formData.append('pinataMetadata', pinataMetadata);

        const response = await axios.post(
            `${PINATA_API_URL}/pinning/pinFileToIPFS`,
            formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
                    'pinata_api_key': process.env.PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.PINATA_API_SECRET
                }
            }
        );

        return response.data.IpfsHash;
    } catch (error) {
        console.error('Error uploading to Pinata:', error.response ? error.response.data : error);
        throw new Error('Failed to upload to IPFS');
    }
}
