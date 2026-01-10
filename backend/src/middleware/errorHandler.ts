import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): any => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  console.error('Erreur non gérée:', err);

  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Une erreur serveur est survenue',
  });
};
