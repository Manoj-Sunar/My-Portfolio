# Multi-stage build for TypeScript server
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy built files from builder stage - use explicit path
COPY --from=builder /app/dist /app/dist

# Verify the files exist
RUN ls -la /app/dist/ || echo "dist directory not found"

# Expose port
EXPOSE 5000

# Start the server directly from the built file
CMD ["node", "/app/dist/server.cjs"]