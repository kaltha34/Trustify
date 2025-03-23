import Web3 from 'web3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import verificationAbi from '../contracts/IdentityVerification.json' assert { type: 'json' };
import documentsAbi from '../contracts/IdentityDocuments.json' assert { type: 'json' };

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from both root and backend .env files
dotenv.config(); // Load backend .env
dotenv.config({ path: path.join(__dirname, '../../../.env') }); // Load root .env

// Custom error classes
class BlockchainError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = 'BlockchainError';
        this.details = details;
    }
}

class ContractError extends BlockchainError {
    constructor(message, details = {}) {
        super(message);
        this.name = 'ContractError';
        this.code = 'CONTRACT_ERROR';
        this.details = details;
    }
}

class AuthorizationError extends BlockchainError {
    constructor(message, details = {}) {
        super(message);
        this.name = 'AuthorizationError';
        this.code = 'AUTH_ERROR';
        this.details = details;
    }
}

class NetworkError extends BlockchainError {
    constructor(message, details = {}) {
        super(message);
        this.name = 'NetworkError';
        this.code = 'NETWORK_ERROR';
        this.details = details;
    }
}

class BalanceError extends BlockchainError {
    constructor(message, details = {}) {
        super(message);
        this.name = 'BalanceError';
        this.code = 'BALANCE_ERROR';
        this.details = details;
    }
}

class ServiceError extends BlockchainError {
    constructor(message, details = {}) {
        super(message);
        this.name = 'ServiceError';
        this.code = 'SERVICE_ERROR';
        this.details = details;
    }
}

// Helper function for retrying failed operations
async function withRetry(operation, operationName, maxRetries = 5, delayMs = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`\nAttempting ${operationName} (attempt ${attempt}/${maxRetries})...`);
            return await operation();
        } catch (error) {
            if (attempt === maxRetries) {
                console.error(`\n❌ ${operationName} failed after all retries:`, error);
                throw error;
            }
            console.log(`\nRetrying in ${delayMs/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
}

export class BlockchainService {
    constructor() {
        // Initialize Web3 with SKALE testnet
        const rpcUrl = process.env.RPC_URL;
        if (!rpcUrl) {
            throw new BlockchainError(
                'Missing RPC URL',
                { helpMessage: 'Please set RPC_URL in your .env file' }
            );
        }

        // Create Web3 provider with increased timeout
        const provider = new Web3.providers.HttpProvider(rpcUrl, {
            timeout: 30000, // 30 seconds
            reconnect: {
                auto: true,
                delay: 5000,
                maxAttempts: 5,
                onTimeout: true
            }
        });

        this.web3 = new Web3(provider);
        
        // Load contract addresses
        this.verificationContractAddress = process.env.VERIFICATION_CONTRACT;
        this.documentsContractAddress = process.env.DOCUMENTS_CONTRACT;
        
        if (!this.verificationContractAddress || !this.documentsContractAddress) {
            throw new BlockchainError(
                'Missing contract addresses',
                {
                    verificationContract: this.verificationContractAddress,
                    documentsContract: this.documentsContractAddress,
                    helpMessage: 'Please set VERIFICATION_CONTRACT and DOCUMENTS_CONTRACT in your .env file'
                }
            );
        }

        // Load private key
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            throw new BlockchainError(
                'Missing private key',
                { helpMessage: 'Please set PRIVATE_KEY in your .env file' }
            );
        }

        try {
            // Create account from private key
            const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
            
            // Add account to wallet
            this.web3.eth.accounts.wallet.clear();
            this.web3.eth.accounts.wallet.add(account);

            // Set account as default
            this.account = '0x8460A580aD58539128b9d068FbCd07876a501b41';
            this.web3.eth.defaultAccount = this.account;

            // Log account info
            console.log('\nAccount Configuration:');
            console.log('- Account:', this.account);
        } catch (error) {
            throw new BlockchainError(
                'Invalid private key',
                {
                    originalError: error.message,
                    helpMessage: 'Please check your PRIVATE_KEY in .env file'
                }
            );
        }

        // Initialize contract instances
        this.verificationContract = new this.web3.eth.Contract(
            verificationAbi.abi,
            this.verificationContractAddress
        );

        this.documentsContract = new this.web3.eth.Contract(
            documentsAbi.abi,
            this.documentsContractAddress
        );

        this.initialized = false;
    }

    async initialize() {
        try {
            console.log('\nInitializing blockchain service...');

            // Check network connection
            await this.checkNetworkConnection();

            // Check account balance
            await this.checkAccountBalance();

            // Verify contract permissions
            await this.verifyContractPermissions();

            this.initialized = true;
            console.log('\n✅ Blockchain service initialized successfully');
            return true;
        } catch (error) {
            console.error('\n❌ Blockchain service initialization failed:', {
                name: error.name,
                code: error.code,
                message: error.message
            });
            throw error;
        }
    }

    async checkNetworkConnection() {
        try {
            console.log('\nChecking network connection...');
            const networkId = await withRetry(
                () => this.web3.eth.net.getId(),
                'Network connection test'
            );
            console.log('Connected to network:', networkId);
            return true;
        } catch (error) {
            throw new NetworkError(
                'Failed to connect to network',
                { originalError: error.message }
            );
        }
    }

    async checkAccountBalance() {
        try {
            console.log('\nChecking account balance...');
            const balance = await withRetry(
                () => this.web3.eth.getBalance(this.account),
                'Balance check'
            );
            const ethBalance = this.web3.utils.fromWei(balance, 'ether');
            console.log('Account balance:', ethBalance, 'ETH');

            if (parseFloat(ethBalance) < 0.01) {
                throw new BalanceError(
                    'Insufficient balance',
                    {
                        balance: ethBalance,
                        helpMessage: 'Please get test sFUEL from SKALE faucet'
                    }
                );
            }

            return true;
        } catch (error) {
            if (error instanceof BlockchainError) throw error;
            throw new BalanceError(
                'Failed to check balance',
                { originalError: error.message }
            );
        }
    }

    async verifyContractPermissions() {
        try {
            console.log('\nVerifying contract permissions...');

            // Check if account is a verifier
            const isVerifier = await withRetry(
                () => this.verificationContract.methods.isVerifier(this.account).call(),
                'Check verifier status'
            );

            if (!isVerifier) {
                // Check if account is contract owner
                const ownerAddress = await withRetry(
                    () => this.verificationContract.methods.owner().call(),
                    'Get contract owner'
                );

                if (ownerAddress.toLowerCase() !== this.account.toLowerCase()) {
                    throw new AuthorizationError(
                        'Account not authorized',
                        {
                            account: this.account,
                            ownerAddress,
                            helpMessage: 'The current account is not the contract owner or a registered verifier'
                        }
                    );
                }

                // Add account as verifier if it's the owner
                console.log('\nAdding account as verifier...');
                await withRetry(
                    () => this.verificationContract.methods.addVerifier(this.account).send({
                        from: this.account,
                        gas: 500000
                    }),
                    'Add verifier'
                );

                console.log('✅ Account added as verifier');
            } else {
                console.log('✅ Account is already a verifier');
            }

            return true;
        } catch (error) {
            if (error instanceof BlockchainError) throw error;
            throw new ContractError(
                'Failed to verify contract permissions',
                { originalError: error.message }
            );
        }
    }

    async uploadDocument(docType, ipfsHash) {
        try {
            if (!this.initialized) {
                throw new ServiceError(
                    'Service not initialized',
                    { helpMessage: 'Call initialize() before uploading documents' }
                );
            }

            console.log('\nUploading document to blockchain...');
            console.log('Document Type:', docType);
            console.log('IPFS Hash:', ipfsHash);

            const tx = await withRetry(
                () => this.documentsContract.methods.submitDocument(docType, ipfsHash).send({
                    from: this.account,
                    gas: 500000
                }),
                'Upload document'
            );

            console.log('✅ Document uploaded successfully');
            return tx;
        } catch (error) {
            if (error instanceof BlockchainError) throw error;
            throw new ContractError(
                'Failed to upload document',
                { originalError: error.message }
            );
        }
    }

    async getDocument(docType) {
        try {
            if (!this.initialized) {
                throw new ServiceError(
                    'Service not initialized',
                    { helpMessage: 'Call initialize() before getting document details' }
                );
            }

            console.log('\nGetting document details...');
            console.log('Document Type:', docType);

            const doc = await withRetry(
                () => this.documentsContract.methods.getDocument(docType).call(),
                'Get document'
            );

            return {
                ipfsHash: doc.ipfsHash,
                timestamp: doc.timestamp,
                isValid: doc.isValid,
                isVerified: doc.isVerified,
                verifiedBy: doc.verifiedBy
            };
        } catch (error) {
            if (error instanceof BlockchainError) throw error;
            throw new ContractError(
                'Failed to get document',
                { originalError: error.message }
            );
        }
    }

    async verifyDocument(docType) {
        try {
            if (!this.initialized) {
                throw new ServiceError(
                    'Service not initialized',
                    { helpMessage: 'Call initialize() before verifying documents' }
                );
            }

            console.log('\nVerifying document...');
            console.log('Document Type:', docType);

            const tx = await withRetry(
                () => this.documentsContract.methods.verifyDocument(docType).send({
                    from: this.account,
                    gas: 500000
                }),
                'Verify document'
            );

            console.log('✅ Document verified successfully');
            return tx;
        } catch (error) {
            if (error instanceof BlockchainError) throw error;
            throw new ContractError(
                'Failed to verify document',
                { originalError: error.message }
            );
        }
    }

    async addUser(userAddress) {
        try {
            if (!this.initialized) {
                throw new ServiceError(
                    'Service not initialized',
                    { helpMessage: 'Call initialize() before adding users' }
                );
            }

            console.log('\nAdding user to verification contract...');
            console.log('User Address:', userAddress);

            // Check if already a user
            const isUser = await withRetry(
                () => this.verificationContract.methods.isUser(userAddress).call(),
                'Check user status'
            );

            if (isUser) {
                console.log('✅ Address is already registered as a user');
                return true;
            }

            // Add user
            const tx = await withRetry(
                () => this.verificationContract.methods.addUser(userAddress).send({
                    from: this.account,
                    gas: 500000
                }),
                'Add user'
            );

            console.log('✅ User added successfully');
            return tx;
        } catch (error) {
            if (error instanceof BlockchainError) throw error;
            throw new ContractError(
                'Failed to add user',
                { originalError: error.message }
            );
        }
    }
}

export { BlockchainError, ContractError, AuthorizationError, NetworkError, BalanceError, ServiceError };

// Export error classes
export { BlockchainError, ContractError, AuthorizationError, NetworkError, BalanceError, ServiceError };
