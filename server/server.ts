import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import { createServer as createViteServer } from 'vite';
import { connectDB, loadDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from "./routes/index.js";

async function bootstrap() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // 0. Connect and Seed MongoDB / Local fallback Database
  await connectDB();
  
  // Initialize database on startup
  try {
    const db = loadDB();
    console.log('[Database] Successfully initialized with data.');
    console.log(`[Database] Projects: ${db.projects?.length || 0}`);
    console.log(`[Database] Education: ${db.education?.length || 0}`);
    console.log(`[Database] Certificates: ${db.certificates?.length || 0}`);
  } catch (error) {
    console.error('[Database] Failed to initialize database:', error);
  }

  // Helmet application security layers
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://res.cloudinary.com', '*'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          connectSrc: ["'self'", 'https://api.cloudinary.com', '*'],
        },
      } : false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // 1. Core Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 2. CORS middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // 3. Establish Static Public uploads directory
  const localUploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(localUploadsDir)) {
    fs.mkdirSync(localUploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(localUploadsDir));

  // 4. Mount Consolidated API Router
  app.use('/api', apiRouter);

  // General health check
  app.get('/api/health', (req, res) => {
    const db = loadDB();
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      dataCounts: {
        projects: db.projects?.length || 0,
        education: db.education?.length || 0,
        certificates: db.certificates?.length || 0
      }
    });
  });






  // Global Error Handler Middleware
  app.use(errorHandler);

  // 5. Start Listener
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Portfolio Maker backend running on http://localhost:${PORT}`);
    console.log(`[Server] API endpoints available at http://localhost:${PORT}/api`);
  });
}




bootstrap().catch((error) => {
  console.error('[Critical Boot Crash]', error);
  process.exit(1);
});