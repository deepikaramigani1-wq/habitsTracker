import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import checkinRoutes from "./routes/checkinRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";

console.log("Starting server...");


// Load .env
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Configure allowed origins from environment. Use `FRONTEND_URL` for
// production and optionally `PREVIEW_FRONTEND_URL` for preview/staging.
const allowedOrigins = [
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) : []),
  ...(process.env.PREVIEW_FRONTEND_URL ? process.env.PREVIEW_FRONTEND_URL.split(',').map(url => url.trim()) : []),
];

// Request logging middleware (before CORS)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | Origin: ${req.get('origin') || 'none'}`);
  next();
});

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    console.log(`  CORS check: origin="${origin}", allowed=${allowedOrigins.includes(origin)}`);
    // Allow requests with no origin (e.g., curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Not allowed
    const err = new Error('CORS origin denied');
    return callback(err);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  preflightContinue: false,
}));

console.log('CORS allowed origins:', allowedOrigins.length ? allowedOrigins : 'none (will allow server-to-server requests only)');

app.use(express.json());

// Request body logging middleware
app.use((req, res, next) => {
  if (req.method !== 'OPTIONS' && req.body && Object.keys(req.body).length > 0) {
    console.log(`  Body:`, JSON.stringify(req.body));
  }
  res.on('finish', () => {
    console.log(`  Response: ${res.statusCode}`);
  });
  next();
});

// API Routes
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/challenges", challengeRoutes);

// Fallback for unknown routes (Express 5)
app.use((req, res) => {
  console.error(`[404] Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ message: "Route not found", path: req.path, method: req.method });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Start Server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

