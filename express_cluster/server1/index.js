const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_ID = process.env.SERVER_ID || "server1";
const MONGO_URI = process.env.MONGO_URI;

// ─── Security & Performance Middleware ───────────────────────────────────────
app.use(helmet());           // Sets secure HTTP headers
app.use(compression());      // Gzip compress all responses
app.use(express.json({ limit: "10kb" })); // Body parser, limit payload size
app.use(morgan("combined")); // Request logging

// Rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      // Connection pool - allows handling many concurrent requests
      maxPoolSize: 50,          // Max 50 simultaneous connections
      minPoolSize: 10,          // Keep 10 connections always alive
      socketTimeoutMS: 45000,   // Close sockets after 45s of inactivity
      serverSelectionTimeoutMS: 5000, // Fail fast if DB unreachable
      heartbeatFrequencyMS: 10000,    // Check DB health every 10s
      
      // For write server: write to primary, read from primary too
      readPreference: "primary",
      
      // Write concern: wait for majority of replicas to acknowledge write
      writeConcern: { w: "majority", j: true },
    });
    console.log(`[${SERVER_ID}] Connected to MongoDB Primary`);
  } catch (err) {
    console.error(`[${SERVER_ID}] MongoDB connection failed:`, err.message);
    process.exit(1); // Crash the server so Docker restarts it
  }
};

// ─── Mongoose Schema & Model ──────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [150, "Age seems unrealistic"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

userSchema.index({ createdAt: -1 }); // For sorting by newest

const User = mongoose.model("User", userSchema);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check endpoint (used by NGINX and monitoring tools)
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(dbStatus === "connected" ? 200 : 503).json({
    status: dbStatus === "connected" ? "ok" : "degraded",
    server: SERVER_ID,
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// POST /api/users → Create user (WRITE operation → goes to Primary DB)
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const user = new User({ name, email, age });
    await user.save(); // Saved to Primary, then replicated to Secondaries

    res.status(201).json({
      message: "User created successfully",
      user,
      handledBy: SERVER_ID,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    console.error(`[${SERVER_ID}] Create user error:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/users/:id → Update user (WRITE operation)
app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // Return updated doc, run schema validation
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated", user, handledBy: SERVER_ID });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/users/:id → Delete user (WRITE operation)
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted", handledBy: SERVER_ID });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[${SERVER_ID}] Unhandled error:`, err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[${SERVER_ID}] Write server running on port ${PORT}`);
  });
});

// Graceful shutdown: finish existing requests before closing
process.on("SIGTERM", async () => {
  console.log(`[${SERVER_ID}] SIGTERM received, shutting down gracefully...`);
  await mongoose.connection.close();
  process.exit(0);
});