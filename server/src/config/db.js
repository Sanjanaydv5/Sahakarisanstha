import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './env.js';

let mongodInstance = null;

export const connectDB = async () => {
  try {
    // Try connecting to provided URI with a 2-second timeout
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`✅ MongoDB Connected successfully to: ${config.mongoUri}`);
  } catch (error) {
    console.log(`⚠️ Local MongoDB not detected at ${config.mongoUri}. Initializing embedded MongoDB server...`);
    try {
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'janata_sahakari',
          launchTimeout: 180000 // 3 minutes timeout for binary acquisition if needed
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
