import { Request, Response, NextFunction } from 'express';

interface ApiError extends Error {
  status?: number;
}

// Global error handler middleware for Express
export const errorMiddleware = (
  err: ApiError, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[Error] ${statusCode} - ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }
  
  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

// Standard API response format
export const apiResponse = <T>(
  res: Response, 
  data: T, 
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    status: 'success',
    data,
  });
};

// Async handler to simplify try-catch in route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
