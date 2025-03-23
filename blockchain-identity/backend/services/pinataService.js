import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from both root and backend .env files
dotenv.config(); // Load backend .env
dotenv.config({ path: path.join(__dirname, '../../../.env') }); // Load root .env

// Custom error class for Pinata-related errors
class PinataError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.name = 'PinataError';
        this.code = code;
        this.details = details;
    }
}

export class PinataService {
    constructor() {
        this.apiKey = process.env.PINATA_API_KEY;
        this.apiSecret = process.env.PINATA_API_SECRET;
        this.baseUrl = 'https://api.pinata.cloud';
        this.initialized = false;
        
        // Create axios instance with default config
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'pinata_api_key': this.apiKey,
                'pinata_secret_api_key': this.apiSecret
            }
        });
    }

    async initialize() {
        try {
            console.log('\nInitializing Pinata service...');
            
            // Validate environment variables
            if (!this.apiKey || !this.apiSecret) {
                throw new PinataError(
                    'Missing Pinata API credentials',
                    'CONFIG_ERROR',
                    {
                        hasApiKey: !!this.apiKey,
                        hasApiSecret: !!this.apiSecret,
                        helpMessage: 'Please set PINATA_API_KEY and PINATA_API_SECRET in your .env file.'
                    }
                );
            }

            // Test API connection
            const response = await this.client.get('/data/testAuthentication');
            
            // Success response from Pinata includes a welcome message
            if (response.data.message && response.data.message.includes('Congratulations')) {
                this.initialized = true;
                console.log('\n✅ Pinata service initialized successfully');
                return true;
            }

            throw new PinataError(
                'Invalid Pinata API credentials',
                'AUTH_ERROR',
                { response: response.data }
            );

        } catch (error) {
            if (error instanceof PinataError) {
                if (error.code === 'CONFIG_ERROR') {
                    console.error('\n❌ Pinata configuration error:', {
                        message: error.message,
                        details: error.details
                    });
                    console.log('\n💡 How to fix:');
                    console.log('1. Go to https://app.pinata.cloud/');
                    console.log('2. Sign in to your account');
                    console.log('3. Click on "API Keys" in the sidebar');
                    console.log('4. Create a new API key if you don\'t have one');
                    console.log('5. Copy the API Key and API Secret');
                    console.log('6. Update your .env file with these values');
                } else {
                    console.error('\n❌ Pinata service initialization failed:', {
                        name: error.name,
                        code: error.code,
                        message: error.message,
                        details: error.details
                    });
                }
                throw error;
            }

            // Handle axios errors
            if (error.response) {
                throw new PinataError(
                    'Failed to initialize Pinata service',
                    'AUTH_ERROR',
                    { 
                        statusCode: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data
                    }
                );
            }

            // Convert unknown errors to PinataError
            throw new PinataError(
                'Failed to initialize Pinata service',
                'UNKNOWN_ERROR',
                { originalError: error.message }
            );
        }
    }

    async uploadFile(filePath) {
        try {
            if (!this.initialized) {
                throw new PinataError(
                    'Pinata service not initialized',
                    'SERVICE_ERROR',
                    { helpMessage: 'Call initialize() before uploading files' }
                );
            }

            // Validate file
            if (!fs.existsSync(filePath)) {
                throw new PinataError(
                    'File not found',
                    'FILE_ERROR',
                    { filePath }
                );
            }

            // Create form data
            const formData = new FormData();
            const fileStream = fs.createReadStream(filePath);
            const fileName = path.basename(filePath);

            // Add file to form data
            formData.append('file', fileStream);

            // Add metadata
            const metadata = {
                name: fileName,
                keyvalues: {
                    uploadedAt: new Date().toISOString(),
                    source: 'Trustify Identity System'
                }
            };
            formData.append('pinataMetadata', JSON.stringify(metadata));

            // Add options
            const options = {
                cidVersion: 1,
                wrapWithDirectory: false
            };
            formData.append('pinataOptions', JSON.stringify(options));

            // Upload to Pinata
            console.log('\nUploading file to IPFS...');
            console.log('File:', fileName);

            const response = await this.client.post('/pinning/pinFileToIPFS', formData, {
                maxBodyLength: 'Infinity',
                headers: {
                    ...formData.getHeaders()
                }
            });

            if (!response.data.IpfsHash) {
                throw new PinataError(
                    'Invalid response from Pinata',
                    'RESPONSE_ERROR',
                    { response: response.data }
                );
            }

            console.log('✅ File uploaded successfully');
            console.log('IPFS Hash:', response.data.IpfsHash);
            return response.data.IpfsHash;
        } catch (error) {
            if (error instanceof PinataError) throw error;

            // Handle axios errors
            if (error.response) {
                throw new PinataError(
                    'Failed to upload file to IPFS',
                    'UPLOAD_ERROR',
                    { 
                        statusCode: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data
                    }
                );
            }

            throw new PinataError(
                'Failed to upload file',
                'UPLOAD_ERROR',
                { 
                    filePath,
                    originalError: error.message
                }
            );
        }
    }

    async unpinFile(ipfsHash) {
        try {
            if (!this.initialized) {
                throw new PinataError(
                    'Pinata service not initialized',
                    'SERVICE_ERROR',
                    { helpMessage: 'Call initialize() before unpinning files' }
                );
            }

            const response = await this.client.delete(`/pinning/unpin/${ipfsHash}`);

            console.log('✅ File unpinned successfully');
            console.log('IPFS Hash:', ipfsHash);
            return true;
        } catch (error) {
            if (error instanceof PinataError) throw error;

            // Handle axios errors
            if (error.response) {
                throw new PinataError(
                    'Failed to unpin file from IPFS',
                    'UNPIN_ERROR',
                    { 
                        statusCode: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data,
                        ipfsHash
                    }
                );
            }

            throw new PinataError(
                'Failed to unpin file',
                'UNPIN_ERROR',
                { 
                    ipfsHash,
                    originalError: error.message
                }
            );
        }
    }
}

export { PinataError };
