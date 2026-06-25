# Stage 1: Build the TypeScript Express application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files (now relative to server folder)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the production bundle
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy package files
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built assets
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p public/uploads

EXPOSE 5000

CMD ["node", "dist/server.cjs"]