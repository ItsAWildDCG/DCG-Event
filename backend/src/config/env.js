import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'change_me_to_a_long_random_secret',
  storageMode: process.env.STORAGE_MODE || 'memory',
  mongoUri: process.env.MONGODB_URI || '',
  mongoDbName: process.env.MONGODB_DB_NAME || 'EventManagement',
  seedDemoData:
    process.env.SEED_DEMO_DATA !== undefined
      ? process.env.SEED_DEMO_DATA === 'true'
      : (process.env.STORAGE_MODE || 'memory') !== 'mongo'
};
