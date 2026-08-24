import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';
import { User } from '../server/src/models/User.js';
import { seedDatabase } from '../server/src/config/seed.js';

let isSeeded = false;

export default async function handler(req, res) {
  try {
    await connectDB();

    // Auto-seed default credentials and settings on first initialization if empty
    if (!isSeeded) {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('⚡ Empty database detected on Vercel. Running initial data seeder...');
        await seedDatabase();
      }
      isSeeded = true;
    }

    return app(req, res);
  } catch (error) {
    console.error('❌ Vercel Serverless Function Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection or server error occurred on Vercel',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
