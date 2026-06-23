# Stage 1: Build and compile the TypeScript Express application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install dependencies including devDependencies to run types & compilation
RUN npm ci

# Copy the entire server source files
COPY . .

# Build the production bundle using esbuild
RUN npm run build

# Stage 2: Clean and minimal production runtime environment
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=5000

# Copy compiled assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production-only dependencies
RUN npm ci --only=production

# Set up local directories for persistent fallbacks or logs
RUN mkdir -p public/uploads

# Expose the internally mapped PORT
EXPOSE 5000

# Launch the production consolidated server CJS model
CMD ["node", "dist/server.cjs"]
