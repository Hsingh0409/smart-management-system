import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

// Protect routes - verify JWT token
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { message: 'No token provided, authorization denied' },
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: { message: 'No token provided, authorization denied' },
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as { id: string };

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        error: { message: 'Token is not valid' },
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: { message: 'Token is not valid' },
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: { message: 'Token has expired' },
      });
    }
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Admin authorization middleware
export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: { message: 'Not authorized' },
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: { message: 'Access denied. Admin privileges required' },
    });
  }

  next();
};
