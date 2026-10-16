import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/index.js';
import { loadDB } from '../config/database.js';
import { env } from '../config/env.js';

export const AUTH_COOKIE_NAME = 'admin_token';

export interface JwtPayload {
  email: string;
  name: string;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    const cookieToken = (req as any).cookies?.[AUTH_COOKIE_NAME];
    if (typeof cookieToken === 'string' && cookieToken.length > 0) {
      token = cookieToken;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.slice(7).trim();
    }

    if (!token) {
      res.status(401).json({ message: 'Authentication required: No token provided' });
      return;
    }

    jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        res.status(401).json({ message: 'Authentication failed: Token is expired or invalid' });
        return;
      }

      const payload = decoded as JwtPayload;
      const db = loadDB();

      if (!db?.admin?.email || db.admin.email !== payload.email) {
        res.status(401).json({ message: 'Authentication failed: User no longer exists' });
        return;
      }

      req.adminEmail = payload.email;
      req.adminName = payload.name;
      next();
    });
  } catch (error) {
    console.error('[Auth Middleware]', error);
    res.status(500).json({ message: 'Server authentication middleware error' });
  }
};