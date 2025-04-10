import { Request, Response, NextFunction } from 'express';

// 비동기 핸들러 래퍼
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 표준 API 응답 포맷팅
export const apiResponse = (res: Response, data: any, statusCode = 200) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    data
  });
};

// 글로벌 에러 처리 미들웨어
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[Error] ${message}`, err);
  
  return apiResponse(
    res, 
    { 
      error: message,
      status: 'error',
      path: req.path 
    }, 
    statusCode
  );
};
