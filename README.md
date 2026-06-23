# 🚀 Fully Production-Ready Containerized Portfolio System

This is a modern, high-performance, and fully dockerized multi-container full-stack application. It features a decoupled, ultra-fast **React SPAs (Vite)** serving layer compiled into **Nginx Alpine**, a unified **Express / TypeScript API** server, and a dual-persistent caching and storage engine backed by **Redis** and **MongoDB**.

---

## 🏛️ System Architecture

Our production-ready containerized pipeline isolates operations into secure micro-concerns:

```
                  ┌────────────────────────┐
                  │      User Browser      │
                  └───────────┬────────────┘
                              │ Port 3000 (HTTP)
                              ▼
        ┌──────────────────────────────────────────────┐
        │        Client Service Container              │
        │  ──────────────────────────────────────────  │
        │ - Serves Compiled Client Assets (React/Vite) │
        │ - Handles Reverse-Proxy Routing via Nginx   │
        └───────┬──────────────────────────────┬───────┘
                │ /                            │ /api
                ▼ (Serve Static Index)         ▼ (Internal Network Route)
     ┌──────────────────────┐        ┌─────────────────────────┐
     │ Static Asset Storage │        │ Server Service Container│
     └──────────────────────┘        │ (Express API Node CJS)  │
                                     └─────┬──────────────┬────┘
                                           │              │
                                           ▼ (Port 6379)  ▼ (Port 27017)
                                     ┌───────────┐  ┌───────────┐
                                     │ Redis     │  │ MongoDB   │
                                     │ Caching   │  │ Database  │
                                     └───────────┘  └───────────┘
```

1. **Client Service (`portfolio_client`)**: Powered by an interactive multi-stage build. A lightweight **Nginx** server serves built React assets, enables on-the-fly **Gzip compression**, manages asset cache-headers, and redirects all API calls securely to `/api` inside the docker network.
2. **Server Service (`portfolio_server`)**: Running Express and compiled TypeScript. Acts as a unified controller with rich validators, automated error interceptors, image asset uploads management, and direct integration with Redis.
3. **Caching Layer (`portfolio_redis`)**: Redis memory caching for ultra-fast reading. Includes periodic snapshot writing and memory optimization.
4. **Data Store (`portfolio_database`)**: Document-based MongoDB store mapping credentials, education elements, and projects with fully loaded seeding hooks on startup.

---

## ✨ Features and Capabilities

*   **Sequential Healthchecks**: Prevents container crash loops. Docker Compose orchestration enforces proper sequence: MongoDB & Redis must be fully initialized and healthy, *then* the API Server boots, and *only* when the API Server responds on `/api/health` does the React static server initiate.
*   **Dual Data Persistence**: Secure persistent data across container lifecycle events through Docker named volumes. Saves local uploads `/server/public/uploads` and Mongo document storage structures safely.
*   **Edge GZIP Compression**: Pre-configured Nginx assets compression ensures rapid page loading over low-bandwidth client links.
*   **Dynamic Cache Clearing**: The Redis model keeps portfolio loads sub-millisecond, yet invalidates seamlessly if an administrative modification is made to projects, history logs, or about details.

---

## 📦 Setting Up the Environment

A production-configured environment template has been generated at **`/.env.docker`**. 

1. Duplicate `.env.docker` or use it directly:
   ```bash
   cp .env.docker .env
   ```
2. Configure your optional parameters, such as **Cloudinary** for image delivery or **NVIDIA / Gemini Keys** for text creation support:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

---

## 🚀 Running the Stack

To build and run the services in a background containerized daemon state, run the following Docker Compose commands from your project root:

### 1. Build and Launch the Stack
```bash
docker-compose --env-file .env.docker up --build -d
```

### 2. Verify Container Health
Wait 10-15 seconds for healthchecks to evaluate. List running container information:
```bash
docker-compose ps
```
You should see all four containers reporting `Up` and `healthy`:
*   `portfolio_client` (Serving on `http://localhost:3000`)
*   `portfolio_server` (Internal service on default Port `5000`)
*   `portfolio_redis` (Port `6379`)
*   `portfolio_database` (Port `27017`)

---

## 🛠️ Management, Logging & Diagnostics

### Retrieve Live Running Logs
To monitor events like DB synchronization, API handling, and cache writes:
```bash
# General consolidated logs feed
docker-compose logs -f

# Read logs of the backend server specifically
docker-compose logs -f server
```

### Accessing Redis and DB CLI Directly
You can jump directly inside your container shell for diagnosis or debugging:
```bash
# Read live caching transactions
docker-exec -it portfolio_redis redis-cli ping

# Query local database documents
docker-exec -it portfolio_database mongosh
```

### Shutting Down the Stack
To securely stop services and retain data volumes:
```bash
docker-compose down
```
To clear databases and start entirely fresh (removes databases and upload directories completely):
```bash
docker-compose down -v
```

---

## 🔒 Security Best Practices Implemented

*   **Strict CORS & CSP Compliance**: Integrated customized **Helmet** protection headers preventing cross-site scripting (XSS), framing, and payload manipulation in production.
*   **Sub-network Isolation**: Only the Nginx frontend (`portfolio_client`) needs public mapping to port `3000`. The DB server, Redis instance, and main Node process are locked securely within the private Docker local bridge network and are not accessible from the wide web!
