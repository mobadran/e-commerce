// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

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
import connectDB from "./config/db.js";

connectDB();

// Routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import productsRoutes from "./routes/products.route.js";
import adminRoutes from "./routes/admin.route.js";


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
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});