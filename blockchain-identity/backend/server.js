import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recordRoutes from './routes/recordRoutes.js';
import blockchainService from './services/blockchainService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize blockchain service
await blockchainService.initialize();

// Routes
app.use('/api/records', recordRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
