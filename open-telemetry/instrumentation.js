import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { logs } from "@opentelemetry/api-logs";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import winston from "winston";

/**
 * Configuration options for the observability SDK
 * @typedef {Object} ObservabilityConfig
 * @property {string} serviceName - Name of the service
 * @property {string} otlpEndpoint - OTLP endpoint URL (without /v1/traces or /v1/logs)
 * @property {string} [logLevel] - Log level (default: 'info')
 */

/**
 * Initialize OpenTelemetry instrumentation
 * @param {ObservabilityConfig} config - Configuration options
 * @returns {Object} - Returns logger and shutdown function
 */
export function initObservability(config) {
  const {
    serviceName = "my-service",
    otlpEndpoint = "http://localhost:4318",
    logLevel = "info"
  } = config;

  // Create OTLP exporters
  const traceExporter = new OTLPTraceExporter({
    url: `${otlpEndpoint}/v1/traces`,
  });

  const logExporter = new OTLPLogExporter({
    url: `${otlpEndpoint}/v1/logs`,
  });

  // Create resource with service name
  const resource = new Resource({
    [ATTR_SERVICE_NAME]: serviceName,
  });

  // Initialize Logger Provider
  const loggerProvider = new LoggerProvider({
    resource,
  });
  loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));

  // Register the logger provider globally
  logs.setGlobalLoggerProvider(loggerProvider);

  // Create Winston logger
  const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: {
      service: serviceName,
    },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ level, message, timestamp, ...metadata }) => {
            let msg = `${timestamp} [${level}]: ${message}`;
            if (Object.keys(metadata).length > 0) {
              msg += ` ${JSON.stringify(metadata)}`;
            }
            return msg;
          })
        ),
      }),
    ],
  });

  // Initialize Node SDK
  const sdk = new NodeSDK({
    resource,
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": {
          enabled: false,
        },
      }),
      new WinstonInstrumentation({
        logHook: (span, record) => {
          record["resource.service.name"] = serviceName;
        },
      }),
    ],
  });

  // Start the SDK
  try {
    sdk.start();
    console.log("OpenTelemetry instrumentation initialized successfully");
  } catch (error) {
    console.error("Error initializing OpenTelemetry:", error);
  }

  // Handle graceful shutdown
  const shutdown = () => {
    return sdk
      .shutdown()
      .then(() => console.log("OpenTelemetry SDK shut down successfully"))
      .catch((error) =>
        console.error("Error shutting down OpenTelemetry:", error)
      );
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  return { logger, shutdown };
}

// For backward compatibility, also export the loggerProvider
export { loggerProvider };
