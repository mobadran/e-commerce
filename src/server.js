// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// * Ensure indexes are created
// * Only uncomment it when you need to sync indexes then comment it again
// import mongoose from 'mongoose';
// import Review from './models/review.model.js';

// mongoose.connection.once('open', async () => {
//   try {
//     await Review.syncIndexes(); // Ensures indexes are applied
//     console.log("Indexes synced!");
//   } catch (error) {
//     console.error("Error syncing indexes:", error);
//   }
// });

import http from 'http';
import express from "express";
const app = express();
const server = http.createServer(app);

let connections = new Set();

// Track new connections
server.on("connection", (conn) => {
  connections.add(conn);
  conn.on("close", () => connections.delete(conn));
});

import cors from "cors";
// ! Stop using morgan in development
// import morgan from "morgan";
// import fs from "fs";
import cookieParser from 'cookie-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
import { connectDB, disconnectDB } from "./config/db.js";

connectDB();

// Routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import productsRoutes from "./routes/products.route.js";
import adminRoutes from "./routes/admin.route.js";

// Utilities
import colorize from "./utils/colorize.js";


// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cors()); // Enable CORS
app.use(cookieParser());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "..", "public")));

// ! Stop using morgan in development
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// app.use(morgan(":method :url\n  Status Code: :status\n  Response Time: :response-time ms\n  Time: :date[clf]\n", { stream: accessLogStream })); // Log requests


// Routes
// * Was just testing graceful shutdown
// app.get("/test", (req, res) => {
//   console.log("Started");
//   setTimeout(() => {
//     console.log("Ended");
//     return res.send("OK");
//   }, 10000);
// });
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/admin", adminRoutes);


// 404 Not Found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: `${req.originalUrl} Endpoint Not Found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`✅ Server Running: ${colorize(`http://localhost:${PORT}`, 'blue')}`);
});;

const shutdown = async () => {
  console.log("🛑 Gracefully shutting down...");

  // Stop accepting new requests
  server.close(() => {
    console.log("✅ Server stopped accepting new requests.");
    checkAllConnectionsClosed();
  });

  // Close all active connections when finished
  for (const conn of connections) {
    conn.on("close", checkAllConnectionsClosed);
  }

  // Disconnect from MongoDB
  try {
    await disconnectDB();
    console.log("✅ MongoDB Disconnected");
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }

  // Force shutdown if cleanup takes too long
  setTimeout(() => {
    console.error("⏳ Force shutting down...");
    process.exit(1);
  }, 10000);
};

// Function to check if all connections are closed
const checkAllConnectionsClosed = () => {
  if (connections.size === 0) {
    console.log("✅ All connections closed.");
    process.exit(0);
  }
};

// Graceful shutdown
process.on('SIGINT', shutdown); // CTRL + C
process.on('SIGTERM', shutdown); // Termination (e.g., docker stop)