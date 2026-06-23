# Stage 1: Build the React client app with Node and Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definition configs
COPY package*.json ./

# Install packages including devDependencies needed for compiling TS
RUN npm ci

# Copy the entire client directory source files
COPY . .

# Compile application using vite build
RUN npm run build

# Stage 2: Serve the optimized production assets with Nginx
FROM nginx:alpine AS runner

# Remove default static landing page content
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from standard multi-stage build directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace standard Nginx configurations with our robust custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx serving port
EXPOSE 80

# Execute server in foreground
CMD ["nginx", "-g", "daemon off;"]