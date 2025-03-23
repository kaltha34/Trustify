import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PINATA_API_URL = 'https://api.pinata.cloud';

export class PinataService {
    constructor() {
        // Check required environment variables
        if (!process.env.PINATA_API_KEY || !process.env.PINATA_API_SECRET) {
            throw new Error('PINATA_API_KEY or PINATA_API_SECRET not found in environment variables');
        }

        this.headers = {
            'pinata_api_key': process.env.PINATA_API_KEY,
            'pinata_secret_api_key': process.env.PINATA_API_SECRET
        };
    }

    async uploadFile(filePath, metadata = {}) {
        try {
            console.log('Preparing IPFS upload...');
            console.log('File path:', filePath);

            // Verify file exists
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }

            // Create form data
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));

            // Add pinata metadata
            formData.append('pinataMetadata', JSON.stringify({
                name: metadata.name || 'Trustify Document',
                keyvalues: {
                    app: 'trustify',
                    type: metadata.type || 'document',
                    owner: metadata.owner || 'unknown',
                    timestamp: new Date().toISOString()
                }
            }));

            // Add pinata options
            formData.append('pinataOptions', JSON.stringify({
                cidVersion: 1,
                wrapWithDirectory: false
            }));

            console.log('Uploading to Pinata...');
            const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
                method: 'POST',
                headers: this.headers,
                body: formData
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('Pinata API error:', error);
                throw new Error(`Failed to upload to Pinata: ${error}`);
            }

            const result = await response.json();
            console.log('IPFS upload successful:', result);

            return {
                ipfsHash: result.IpfsHash,
                pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('IPFS upload error:', error);
            throw error;
        }
    }

    async testConnection() {
        try {
            console.log('Testing Pinata connection...');
            const response = await fetch(`${PINATA_API_URL}/data/testAuthentication`, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Pinata authentication failed: ${error}`);
            }

            const result = await response.json();
            console.log('Pinata connection test successful:', result);
            return true;
        } catch (error) {
            console.error('Pinata connection test failed:', error);
            throw error;
        }
    }
}
