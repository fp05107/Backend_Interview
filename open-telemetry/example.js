// Example usage of the observability SDK
import { initObservability } from "./instrumentation.js";
import express from "express";

// Initialize observability - configure with your SaaS endpoint
const { logger } = initObservability({
  serviceName: "my-express-app",
  otlpEndpoint: process.env.OTEL_ENDPOINT || "http://31.97.206.6:4318", // Your SigNoz endpoint
  logLevel: "info"
});

const app = express();

// Add JSON body parser middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

app.get("/", (req, res) => {
  logger.info("Root endpoint accessed");
  return res.json({ msg: "Hey There" });
});

// Example endpoint with different log levels
app.get("/api/health", (req, res) => {
  logger.debug("Health check endpoint called");
  return res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("/api/error", (req, res) => {
  logger.error("Error endpoint accessed - simulating an error", {
    endpoint: "/api/error",
    errorType: "simulation",
  });
  return res.status(500).json({ error: "Something went wrong!" });
});

app.post("/api/data", (req, res) => {
  logger.info("Data received", { body: req.body });
  return res.json({ received: true, data: req.body });
});

app.listen(9000, () => {
  logger.info("Server is running on port 9000", {
    port: 9000,
    environment: process.env.NODE_ENV || "development",
    serviceName: "my-express-app",
  });
});
