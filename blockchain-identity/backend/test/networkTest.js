import Web3 from 'web3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testNetwork() {
    console.log('\n=== Testing SKALE Network Connection ===');
    console.log('RPC URL:', process.env.RPC_URL);

    try {
        // Create Web3 provider
        const provider = new Web3.providers.HttpProvider(process.env.RPC_URL);
        const web3 = new Web3(provider);

        // Test network connection
        console.log('\n1. Testing basic connection...');
        const isListening = await web3.eth.net.isListening();
        console.log('Network is listening:', isListening);

        // Get network ID
        console.log('\n2. Getting network info...');
        const chainId = await web3.eth.getChainId();
        console.log('Chain ID:', chainId);
        console.log('Expected Chain ID:', 974399131);

        // Set up account
        console.log('\n3. Testing account setup...');
        const privateKey = process.env.PRIVATE_KEY.startsWith('0x') ? 
            process.env.PRIVATE_KEY : 
            '0x' + process.env.PRIVATE_KEY;
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        console.log('Account:', account.address);

        // Get balance
        console.log('\n4. Getting account balance...');
        const balance = await web3.eth.getBalance(account.address);
        console.log('Balance:', web3.utils.fromWei(balance, 'ether'), 'SKALE ETH');

        // Check contract code
        console.log('\n5. Checking contract deployments...');
        console.log('Verification Contract:', process.env.VERIFICATION_CONTRACT);
        const verificationCode = await web3.eth.getCode(process.env.VERIFICATION_CONTRACT);
        console.log('Verification contract deployed:', verificationCode !== '0x');

        console.log('\nDocuments Contract:', process.env.DOCUMENTS_CONTRACT);
        const documentsCode = await web3.eth.getCode(process.env.DOCUMENTS_CONTRACT);
        console.log('Documents contract deployed:', documentsCode !== '0x');

        console.log('\n✅ Network test successful!');
        return true;
    } catch (error) {
        console.error('\n❌ Network test failed:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        return false;
    }
}

// Run the test
testNetwork().then(success => {
    process.exit(success ? 0 : 1);
});
