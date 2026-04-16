import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectMongoIfEnabled() {
  if (env.storageMode !== 'mongo') {
    return;
  }

  if (!env.mongoUri) {
    throw new Error('STORAGE_MODE is mongo but MONGODB_URI is missing.');
  }

  await mongoose.connect(env.mongoUri, {
    dbName: env.mongoDbName
  });

  console.log('MongoDB connected');
}
