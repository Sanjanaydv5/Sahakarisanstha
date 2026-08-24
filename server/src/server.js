import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './config/seed.js';
import { User } from './models/User.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import billRoutes from './routes/billRoutes.js';
import registerRoutes from './routes/registerRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import duesRoutes from './routes/duesRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// CORS Configuration
app.use(cors({
  origin: '*',
  credentials: true
}));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes'
  }
});

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(requestLogger);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Janata Sahayogi Krishi Sahakari Sanstha Limited API',
    organization: 'जनता सहयोगी कृषि सहकारी संस्था लिमिटेड',
    address: 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)',
    time: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/dues', duesRoutes);
app.use('/api/reports', reportRoutes);

// Global Error Handler
app.use(errorHandler);

// Connect DB and Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is freshly started
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Empty database detected. Running initial data seeder...');
      await seedDatabase();
    }

    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT}`);
      console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();

export default app;
