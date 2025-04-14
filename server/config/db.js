const mongoose = require('mongoose');
require('dotenv').config();

const MAX_RETRIES = 3; // Max connection retries
const RETRY_DELAY_MS = 5000; // 5 seconds between retries

const connectDB = async (retryCount = 0) => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI is not defined in .env');
    }

    // Simple connection without deprecated options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s
    });

    console.log('✅ MongoDB connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

  } catch (err) {
    console.error(`❌ MongoDB connection attempt ${retryCount + 1} failed:`, err.message);

    // Special case: Prompt user to URL-encode password if auth fails
    if (err.message.includes('bad auth') && process.env.MONGODB_URI.includes('@')) {
      console.log('💡 Pro Tip: URL-encode special characters in your password (e.g., "<" → "%3C")');
    }

    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(retryCount + 1);
    } else {
      console.error('🔥 All retries exhausted. Shutting down...');
      process.exit(1);
    }
  }
};

module.exports = connectDB;