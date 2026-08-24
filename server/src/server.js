import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './config/seed.js';
import { User } from './models/User.js';

// Connect DB and Start Standalone Server
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
