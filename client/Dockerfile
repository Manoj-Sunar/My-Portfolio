# Multi-stage build for client
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application with production API URL
# This will be overridden by environment variable in Render
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run the app
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy package.json for serve
COPY package*.json ./

# Expose port
EXPOSE 3000

# Start the app with serve
CMD ["serve", "-s", "dist", "-l", "3000"]