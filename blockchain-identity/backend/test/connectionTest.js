import Web3 from 'web3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SKALE_NETWORK = {
    name: 'SKALE Testnet',
    chainId: 974399131
};

async function testConnection() {
    console.log('\n=== Testing SKALE Network Connection ===');
    console.log('RPC URL:', process.env.RPC_URL);

    try {
        // Create basic Web3 provider
        const provider = new Web3.providers.HttpProvider(process.env.RPC_URL);
        const web3 = new Web3(provider);

        // Test network connection
        console.log('\nTesting network connection...');
        const chainId = Number(await web3.eth.getChainId());
        console.log('Chain ID:', chainId);

        if (chainId !== SKALE_NETWORK.chainId) {
            throw new Error(`Wrong network. Expected chainId ${SKALE_NETWORK.chainId}, got ${chainId}`);
        }

        // Test account setup
        console.log('\nTesting account setup...');
        const privateKey = process.env.PRIVATE_KEY.startsWith('0x') ? 
            process.env.PRIVATE_KEY : 
            '0x' + process.env.PRIVATE_KEY;
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        console.log('Account:', account.address);

        // Test contract code
        console.log('\nTesting verification contract...');
        const verificationCode = await web3.eth.getCode(process.env.VERIFICATION_CONTRACT);
        console.log('Verification contract code exists:', verificationCode !== '0x');

        console.log('\nTesting documents contract...');
        const documentsCode = await web3.eth.getCode(process.env.DOCUMENTS_CONTRACT);
        console.log('Documents contract code exists:', documentsCode !== '0x');

        // Test basic contract call
        console.log('\nTesting contract call...');
        const contract = new web3.eth.Contract([{
            name: 'getUserStatus',
            type: 'function',
            inputs: [{ name: 'user', type: 'address' }],
            outputs: [
                { name: 'isRegistered', type: 'bool' },
                { name: 'isVerifier', type: 'bool' }
            ],
            stateMutability: 'view'
        }], process.env.VERIFICATION_CONTRACT);

        const status = await contract.methods.getUserStatus(account.address).call();
        console.log('User status:', status);

        console.log('\n✅ Connection test successful!');
        return true;
    } catch (error) {
        console.error('\n❌ Connection test failed:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        return false;
    }
}

// Run the test
testConnection().then(success => {
    process.exit(success ? 0 : 1);
});
