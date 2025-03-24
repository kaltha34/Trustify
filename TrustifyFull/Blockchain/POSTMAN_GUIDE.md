# Trustify API Testing Guide (Postman)

## Prerequisites
1. Ensure backend is running: `npm start` in the backend directory
2. Have MetaMask or another wallet ready
3. Have test files ready for document upload

## Base URL
```
http://localhost:3001
```

## API Endpoints

### Health Check
- **GET** `/health`
- Tests if the server is running and connected to blockchain
- No authentication required

### User Management

#### Register User
- **POST** `/api/users/register`
- Register a new user and create their wallet
```json
{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com"
}
```

#### Login
- **POST** `/api/users/login`
- Login and get JWT token
```json
{
  "username": "testuser",
  "password": "password123"
}
```

#### Get User Profile
- **GET** `/api/users/profile`
- Get user profile and wallet info
- Requires JWT token in Authorization header

### Document Management

#### Upload Document
- **POST** `/api/documents/upload`
- Upload a new document for verification
- Requires JWT token
- Form data:
  - `file`: Document file
  - `metadata`: JSON string containing document details
```json
{
  "title": "Test Document",
  "description": "Test description",
  "expiryDate": "2025-12-31"
}
```

#### Get Document
- **GET** `/api/documents/:documentId`
- Get document details by ID
- Requires JWT token

#### List Documents
- **GET** `/api/documents`
- List all documents owned by user
- Requires JWT token

#### Update Document Status
- **PUT** `/api/documents/:documentId/status`
- Update document verification status
- Requires JWT token and verifier role
```json
{
  "status": "VERIFIED",
  "comments": "Document verified successfully"
}
```

### Verification

#### Request Verification
- **POST** `/api/verification/request`
- Request verification for a document
- Requires JWT token
```json
{
  "documentId": "0x123...",
  "verificationLevel": "BASIC"
}
```

#### Get Verification Status
- **GET** `/api/verification/:requestId`
- Check status of verification request
- Requires JWT token

#### List Verification Requests
- **GET** `/api/verification/requests`
- List all verification requests
- Requires JWT token and verifier role

### Faucet Service

#### Request sFUEL
- **POST** `/api/faucet/request`
- Request sFUEL for wallet
- Requires JWT token
```json
{
  "walletAddress": "0x123..."
}
```

## Step-by-Step API Testing

### 1. Get Authentication Message
```
GET /api/auth/message

Response Example:
{
    "success": true,
    "message": "Authenticate with Trustify",
    "instructions": {
        "step1": "Use your wallet to sign this exact message",
        "step2": "Include the signature and your wallet address in the headers"
    }
}
```
➡️ Action: Copy the message "Authenticate with Trustify" and sign it with your wallet

### 2. Register User
```
POST /api/users/register
Content-Type: application/json

Body:
{
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com"
}

Response Example:
{
    "success": true,
    "message": "User registered successfully"
}
```

### 3. Login
```
POST /api/users/login
Content-Type: application/json

Body:
{
    "username": "testuser",
    "password": "password123"
}

Response Example:
{
    "success": true,
    "token": "JWT token"
}
```

### 4. Upload Document
```
POST /api/documents/upload
Headers:
    Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: [Select File]
- metadata: {
    "title": "Test Document",
    "description": "Test description",
    "expiryDate": "2025-12-31"
}

Response Example:
{
    "success": true,
    "message": "Document uploaded successfully",
    "documentId": "123..."
}
```
➡️ Action: Save the documentId for next steps

### 5. Request Verification
```
POST /api/verification/request
Headers:
    Authorization: Bearer <token>
Content-Type: application/json

Body:
{
    "documentId": "123...",
    "verificationLevel": "BASIC"
}

Response Example:
{
    "success": true,
    "message": "Verification requested successfully"
}
```

### 6. Get Verification Status
```
GET /api/verification/:requestId
Headers:
    Authorization: Bearer <token>

Response Example:
{
    "success": true,
    "status": "PENDING"
}
```

### 7. Update Document Status
```
PUT /api/documents/:documentId/status
Headers:
    Authorization: Bearer <token>
Content-Type: application/json

Body:
{
    "status": "VERIFIED",
    "comments": "Document verified successfully"
}

Response Example:
{
    "success": true,
    "message": "Document status updated successfully"
}
```

### 8. Get User Role
```
GET /api/users/role/{walletAddress}
Headers:
    walletaddress: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    signature: [Your Signature]

Response Example:
{
    "success": true,
    "role": "USER"
}
```

## Common Headers
For all authenticated endpoints, always include:
```
Authorization: Bearer <token>
```

## Error Handling
Common error responses:
```json
{
    "error": true,
    "message": "Error description"
}
```

## Contract Addresses (SKALE Testnet)
- IdentityVerification: `0x2E983A1Ba5e8b38AAAeC4B440B9dDcFBf72E15d1`
- IdentityDocuments: `0x663F3ad617193148711d28f5334eE4Ed07016602`

## Troubleshooting Tips
1. If authentication fails:
   - Ensure you're signing the exact message "Authenticate with Trustify"
   - Check that wallet address matches the one used to sign
   - Verify signature format is correct

2. If document upload fails:
   - Check file size (max 10MB)
   - Ensure metadata is properly formatted JSON
   - Verify you're using multipart/form-data

3. If verification fails:
   - Ensure you have the correct role (VERIFIER)
   - Check if document exists and is in PENDING state
   - Verify you have enough sFUEL for gas fees
