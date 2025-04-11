/**
 * Utilities for formatting API responses
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Standard success response format
export const successResponse = (data: any = {}, message: string = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

// Standard error response format
export const errorResponse = (error: Error | string, statusCode: number = 500) => {
  const message = typeof error === 'string' ? error : error.message;
  
  return {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && typeof error !== 'string' && { stack: error.stack })
  };
};
