import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === '') {
    throw new Error(`[ENV] Missing required env var: ${name}`);
  }
  return v;
}

function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

const NODE_ENV = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
const isProd = NODE_ENV === 'production';

// In production we refuse to boot without real secrets.
const JWT_SECRET = isProd
  ? required('JWT_SECRET')
  : (process.env.JWT_SECRET || 'dev-only-jwt-secret-do-not-use-in-prod');

// Warn loudly if dev is using an obvious placeholder
if (!isProd && JWT_SECRET === 'dev-only-jwt-secret-do-not-use-in-prod') {
  // eslint-disable-next-line no-console
  console.warn('[ENV] Using development JWT secret. DO NOT deploy like this.');
}

export const env = {
  NODE_ENV,
  isProd,
  PORT: Number(process.env.PORT) || 5000,

  JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  CLIENT_ORIGINS: (process.env.CLIENT_ORIGINS || 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  COOKIE_SAMESITE: (process.env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') || 'lax',
  COOKIE_DOMAIN: optional('COOKIE_DOMAIN'),

  REDIS_URL: optional('REDIS_URL'),
  MONGODB_URI: optional('MONGODB_URI'),

  CLOUDINARY: {
    cloudName: optional('CLOUDINARY_CLOUD_NAME'),
    apiKey: optional('CLOUDINARY_API_KEY'),
    apiSecret: optional('CLOUDINARY_API_SECRET'),
  },

  EMAIL: {
    host: process.env.SMTP_HOST || process.env.EMAIL_HOST,
    port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587),
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    secure: (process.env.SMTP_SECURE || process.env.EMAIL_SECURE) === 'true',
    senderName: process.env.SMTP_SENDER_NAME || process.env.EMAIL_SENDER_NAME || 'Portfolio Maker',
  },

  UPLOAD: {
    maxFileSizeBytes: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },

  CACHE: {
    ttlDefault: 3600,
    ttlDashboard: 600,
    memoryMaxEntries: 5000,
  },

  SECURITY: {
    otpMaxAttempts: 5,
    otpLength: 6,
    resetTokenTtlMs: 15 * 60 * 1000,
    otpTtlMs: 10 * 60 * 1000,
    bcryptRounds: 10,
  },
} as const;

export const isCloudinaryConfigured = (): boolean =>
  Boolean(env.CLOUDINARY.cloudName && env.CLOUDINARY.apiKey && env.CLOUDINARY.apiSecret);