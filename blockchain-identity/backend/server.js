import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import recordRoutes from './routes/recordRoutes.js';
import blockchainService from './services/blockchainService.js';

// Load environment variables first
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple route for testing
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Initialize server without waiting for blockchain
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Initialize blockchain service in the background
blockchainService.initialize()
  .then(() => {
    console.log('Blockchain service initialized successfully');
    console.log(`Using contracts on SKALE testnet:`);
    console.log(`- Verification Contract: ${process.env.VERIFICATION_CONTRACT}`);
    console.log(`- Documents Contract: ${process.env.DOCUMENTS_CONTRACT}`);
    
    // Only mount blockchain routes after successful initialization
    app.use('/records', recordRoutes);
  })
  .catch((error) => {
    console.error('Warning: Blockchain service failed to initialize:', error);
    console.log('Server will continue running but blockchain features may not work');
  });
