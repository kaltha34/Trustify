# Trustify - Blockchain Identity Verification System

A decentralized identity verification system built on SKALE Network, enabling secure document verification and management.

## Smart Contracts (SKALE Testnet)

- **IdentityVerification Contract**: `0x123676956F35d9791bf3d679a9f0E0f293427a35`
  - User registration and verification
  - Verifier management
  - User status tracking

- **IdentityDocuments Contract**: `0xF84098EE1b988D6ddC6ab5864E464A97a15913C5`
  - Document management
  - IPFS integration
  - Document verification system

## Network Details

- **Network**: SKALE Testnet (giant-half-dual-testnet)
- **RPC URL**: https://testnet.skalenodes.com/v1/giant-half-dual-testnet

## Project Structure

```
blockchain-identity/
├── backend/                 # Backend server
│   ├── controllers/         # Request handlers
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── server.js           # Main server file
├── contracts/              # Smart contracts
│   ├── IdentityDocuments.sol
│   └── IdentityVerification.sol
├── test/                  # Test suite
│   ├── blockchainTest.js   # Blockchain connectivity tests
│   ├── documentTest.js     # Document operations tests
│   └── revocationTest.js   # Document revocation tests
└── utils/                 # Utilities
    ├── DocumentManager.js   # Document handling
    └── pinataService.js    # IPFS integration
```

## Features

- User registration and verification
- Document upload with IPFS storage
- Document verification by authorized verifiers
- Document revocation
- Status tracking for all documents
- Secure blockchain-based record keeping

## Setup

1. Clone the repository:
```bash
git clone https://github.com/kaltha34/Trustify.git
cd blockchain-identity
```

2. Install dependencies:
```bash
npm install
cd backend && npm install
```

3. Create `.env` file with required configuration:
```env
PRIVATE_KEY=your_private_key
PORT=3000
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_secret
```

## Running Tests

Run blockchain integration tests:
```bash
node test/blockchainTest.js    # Test blockchain connectivity
node test/documentTest.js      # Test document operations
node test/revocationTest.js    # Test document revocation
```

## Starting the Server

Start the backend server:
```bash
cd backend
node server.js
```

## API Endpoints

- `GET /records/approved` - Get approved records
- `GET /records/pending` - Get pending records
- `GET /records/revoked` - Get revoked records
- `GET /documents` - Get all documents
- `POST /documents/upload` - Upload a new document
- `POST /documents/verify` - Verify a document
- `POST /documents/revoke` - Revoke a document

## Document Types

The system supports the following document types:
- National Identity Card (NIC)
- Birth Certificate
- Passport

## Security

- Smart contract security measures implemented
- Role-based access control for verifiers
- Document verification status tracking
- Secure IPFS storage for documents
- Private key management for blockchain interactions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
