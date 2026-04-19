import mongoose from 'mongoose';
import env from './env.js';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
    process.exit(1);
  }
}
