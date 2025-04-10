import express, { Express } from 'express';
import cors from 'cors';
import healthRoute from '@/routes/healthRoute';
import { errorMiddleware } from '@/utils/errorHandler';

export function createApp(): Express {
  const app = express();

  // 미들웨어 설정
  app.use(cors());
  app.use(express.json());
  
  // 요청 로깅
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // 라우트 설정
  app.use('/health', healthRoute);
  
  // 기본 404 핸들러
  app.use((req, res) => {
    res.status(404).json({ 
      success: false,
      data: {
        error: 'Not Found',
        path: req.path
      }
    });
  });

  // 글로벌 에러 핸들러
  app.use(errorMiddleware);

  return app;
}
