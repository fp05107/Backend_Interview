# OpenTelemetry SaaS Instrumentation

A Node.js package that provides easy-to-use OpenTelemetry instrumentation for observability as a service.

## Installation

```bash
npm install otel-saas-instrumentation
```

## Usage

### Basic Setup

```javascript
// Import and initialize at the top of your main file
import { initObservability } from 'otel-saas-instrumentation';

// Initialize with your configuration
const { logger } = initObservability({
  serviceName: 'my-awesome-app',
  otlpEndpoint: 'https://your-saas-endpoint.com', // Your SaaS OTLP endpoint
  logLevel: 'info' // optional, defaults to 'info'
});

// Use the logger throughout your application
logger.info('Application started');
logger.error('Something went wrong', { error: error.message });
```

### Express.js Integration

```javascript
import express from 'express';
import { initObservability } from 'otel-saas-instrumentation';

const { logger } = initObservability({
  serviceName: 'my-express-app',
  otlpEndpoint: process.env.OTEL_ENDPOINT
});

const app = express();

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.json({ message: 'Hello World' });
});

app.listen(3000, () => {
  logger.info('Server running on port 3000');
});
```

## Configuration Options

- `serviceName` (string): Name of your service (default: 'my-service')
- `otlpEndpoint` (string): Your OTLP collector endpoint URL (default: 'http://localhost:4318')
- `logLevel` (string): Winston log level (default: 'info')

## Features

- Automatic tracing for Node.js applications
- Structured logging with Winston
- OTLP HTTP export
- Express.js middleware instrumentation
- Graceful shutdown handling
- Log correlation with traces

## SaaS Offering

This package is designed to work with our observability SaaS platform. Contact us for:

- Hosted SigNoz instance
- Custom dashboards
- Alerting and monitoring
- Support and maintenance

## License

MIT