# Use slim version to reduce image size
FROM node:20-alpine

# Create non-root user for security (never run as root in production)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy package files first (Docker layer caching - npm install only re-runs if package.json changes)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy rest of application code
COPY . .

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check: Docker will restart container if this fails
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

CMD ["node", "index.js"]