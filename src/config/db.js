import mongoose from "mongoose";
import colorize from '../utils/colorize.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${colorize(`${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`, 'blue')}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Exit if connection fails
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};