import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';

export interface AuthRequest extends Request {
  userId?: number;
  username?: string;
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError(401, 'Token manquant'));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as any;
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (err) {
    next(new AppError(401, 'Token invalide'));
  }
};
