const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_ID = process.env.SERVER_ID || "server2";
const MONGO_URI = process.env.MONGO_URI;

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(morgan("combined"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Read servers can handle more requests
  message: { error: "Too many requests" },
});
app.use("/api/", limiter);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 100,  // Read servers handle more connections
      minPoolSize: 20,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      
      // KEY DIFFERENCE: Read from secondary replicas only
      // This offloads read traffic from the primary
      readPreference: "secondaryPreferred",
    });
    console.log(`[${SERVER_ID}] Connected to MongoDB Replica (Read)`);
  } catch (err) {
    console.error(`[${SERVER_ID}] MongoDB connection failed:`, err.message);
    process.exit(1);
  }
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true },
    age: { type: Number, min: 0, max: 150 },
  },
  { timestamps: true }
);

userSchema.index({ createdAt: -1 });

const User = mongoose.model("User", userSchema);

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

// GET /api/users → Get all users with pagination (READ operation)
app.get("/api/users", async (req, res) => {
  try {
    // Pagination: default page 1, limit 20 per page
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20); // Max 100 per page
    const skip = (page - 1) * limit;

    // Run count and find in parallel for performance
    const [users, total] = await Promise.all([
      User.find()
        .select("-__v")     // Exclude __v field
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .lean(),            // .lean() returns plain JS objects (faster, less memory)
      User.countDocuments(),
    ]);

    res.json({
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        perPage: limit,
      },
      handledBy: SERVER_ID,
    });
  } catch (err) {
    console.error(`[${SERVER_ID}] Get users error:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/users/:id → Get single user (READ operation)
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-__v").lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ data: user, handledBy: SERVER_ID });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/users/search?q=john → Search users (READ operation)
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Search query required" });

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },   // Case-insensitive name search
        { email: { $regex: query, $options: "i" } },  // Case-insensitive email search
      ],
    })
      .limit(20)
      .lean();

    res.json({ data: users, count: users.length, handledBy: SERVER_ID });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(`[${SERVER_ID}] Unhandled error:`, err);
  res.status(500).json({ error: "Internal server error" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[${SERVER_ID}] Read server running on port ${PORT}`);
  });
});

process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  process.exit(0);
});