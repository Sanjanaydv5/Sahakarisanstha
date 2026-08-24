import mongoose from 'mongoose';
import { config } from './env.js';

let mongodInstance = null;

export const connectDB = async () => {
  // Return early if already connected (important for serverless warm starts)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const isServerlessOrProd = Boolean(process.env.VERCEL || process.env.NODE_ENV === 'production');

  try {
    // Connect to provided MongoDB URI (e.g., MongoDB Atlas in production/Vercel)
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: isServerlessOrProd ? 8000 : 2000
    });
    console.log(`✅ MongoDB Connected successfully to: ${config.mongoUri.split('@')[1] || config.mongoUri}`);
  } catch (error) {
    if (isServerlessOrProd) {
      console.error('❌ Production MongoDB connection error:', error.message);
      throw error;
    }

    // In local development, fallback to in-memory MongoDB if local daemon is not running
    console.log(`⚠️ Local MongoDB not detected at ${config.mongoUri}. Initializing embedded MongoDB server...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'janata_sahakari',
          launchTimeout: 180000
        }
      });
      const memoryUri = mongodInstance.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ In-Memory MongoDB Server running at: ${memoryUri}`);
    } catch (memError) {
      console.error('❌ Failed to start in-memory MongoDB:', memError.message);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
