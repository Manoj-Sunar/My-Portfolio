import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB, loadDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';
import { redisCache } from './utils/redis.js';

async function bootstrap() {
  const app = express();
  const PORT = Number(process.env.PORT) || 5000;
  const isProd = process.env.NODE_ENV === 'production';

  // Trust proxy — required behind Render / Nginx / any reverse proxy
  // so that `secure` cookies and req.ip work correctly.
  app.set('trust proxy', 1);

  // 0. Connect DB + Redis
  await connectDB();
  await redisCache.initialize();

  try {
    const db = loadDB();
    console.log('[Database] Successfully initialized with data.');
    console.log(`[Database] Projects: ${db.projects?.length || 0}`);
    console.log(`[Database] Education: ${db.education?.length || 0}`);
    console.log(`[Database] Certificates: ${db.certificates?.length || 0}`);
  } catch (error) {
    console.error('[Database] Failed to initialize database:', error);
  }

  // ---------------- CORS ----------------
  // Comma-separated list in env, e.g.:
  // CLIENT_ORIGINS=http://localhost:3000,https://your-frontend.com
  const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, cb) {
        // Allow non-browser tools (Postman, curl) that send no Origin
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS blocked: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
      maxAge: 86400,
    })
  );

  // ---------------- Helmet ----------------
  app.use(
    helmet({
      contentSecurityPolicy: isProd
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
              styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
              imgSrc: [
                "'self'",
                'data:',
                'blob:',
                'https://images.unsplash.com',
                'https://res.cloudinary.com',
              ],
              fontSrc: ["'self'", 'https://fonts.gstatic.com'],
              connectSrc: ["'self'", 'https://api.cloudinary.com'],
              objectSrc: ["'none'"],
              frameAncestors: ["'none'"],
              baseUri: ["'self'"],
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    })
  );

  // ---------------- Parsers ----------------
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser()); // MUST come before routes

  // ---------------- Static uploads ----------------
  const localUploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(localUploadsDir)) {
    fs.mkdirSync(localUploadsDir, { recursive: true });
  }
  app.use(
    '/uploads',
    express.static(localUploadsDir, {
      maxAge: isProd ? '7d' : 0,
      etag: true,
    })
  );

  // ---------------- Health checks ----------------
  app.get('/health', (_req, res) => {
    res.status(200).send('OK');
  });

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    });
  });

  // ---------------- API ----------------
  app.use('/api', apiRouter);

  // ---------------- 404 ----------------
  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  // ---------------- Error handler ----------------
  app.use(errorHandler);

  // ---------------- Listen ----------------
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://localhost:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
    console.log(`[Server] API at http://localhost:${PORT}/api`);
    console.log(`[Server] Allowed origins: ${allowedOrigins.join(', ')}`);
  });

  // ---------------- Graceful shutdown ----------------
  const shutdown = (signal: string) => {
    console.log(`[Server] ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  console.error('[Critical Boot Crash]', error);
  process.exit(1);
});