const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from both root and backend .env files
dotenv.config(); // Load backend .env
dotenv.config({ path: path.join(__dirname, '../../.env') }); // Load root .env

async function testPinataAuth() {
    console.log('\n=== Testing Pinata Authentication ===\n');
    console.log('API Key:', process.env.PINATA_API_KEY);
    console.log('API Secret:', process.env.PINATA_API_SECRET ? '***[hidden]***' : 'Not set');

    try {
        const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
            headers: {
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_API_SECRET
            }
        });

        console.log('\nResponse:', JSON.stringify(response.data, null, 2));
        console.log('\n✅ Authentication successful!');
        return true;
    } catch (error) {
        console.error('\n❌ Authentication failed!');
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Status Text:', error.response.statusText);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received:', error.message);
        } else {
            console.error('Error:', error.message);
        }

        return false;
    }
}

// Run the test
testPinataAuth().then(success => {
    process.exit(success ? 0 : 1);
});
