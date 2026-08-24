import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/janata_sahakari',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_janata_sahakari_2026',
  jwtExpire: process.env.JWT_EXPIRE || '24h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_jwt_key_janata_sahakari_2026',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};
