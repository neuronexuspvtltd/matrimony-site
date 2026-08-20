import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/matrimony_db';
    console.log(`[DB]: Attempting connection to ${connStr}...`);
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Local Server Not Running]. Launching embedded MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create({
        instance: { dbName: 'matrimony_db' }
      });
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoMemoryServer Connected Successfully]: ${uri}`);
    } catch (fallbackErr) {
      console.error(`[MongoDB Memory Server Error]:`, fallbackErr);
    }
  }
};
