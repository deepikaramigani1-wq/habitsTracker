import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import checkinRoutes from "./routes/checkinRoutes.js";

console.log("Starting server...");

// Load .env
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Configure allowed origins from environment. Use `FRONTEND_URL` for
// production and optionally `PREVIEW_FRONTEND_URL` for preview/staging.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.PREVIEW_FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Not allowed
    return callback(new Error('CORS origin denied'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

console.log('CORS allowed origins:', allowedOrigins.length ? allowedOrigins : 'none (will allow server-to-server requests only)');

app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/checkins", checkinRoutes);

// Fallback for unknown routes (Express 5)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

