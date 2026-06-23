import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/index.js';
import { loadDB } from '../config/database.js';


const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-jwt-secret-key-18349';

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Authentication required: Invalid token format' });
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Authentication failed: Token is expired or invalid' });
        return;
      }

      const payload = decoded as { email: string; name: string };
      
      // Verify admin still exists in local DB
      const db = loadDB();
      if (db.admin.email !== payload.email) {
        res.status(401).json({ message: 'Authentication failed: User no longer exists' });
        return;
      }

      req.adminEmail = payload.email;
      req.adminName = payload.name;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Server authentication middleware error', error: String(error) });
  }
};
