import express from 'express';
import cors from 'cors';
import conversationRoutes from './routes/conversationRoutes';
import messageRoutes from './routes/messageRoutes';
import modelConfigRoutes from './routes/modelConfigRoutes';
import mcpServerRoutes from './routes/mcpServerRoutes';
import errorMiddleware from './middleware/errorMiddleware';

const app: express.Application = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'db-service' });
});

// 라우트 등록
app.use('/conversations', conversationRoutes);
app.use('/', messageRoutes); // 메시지 라우트는 복합 경로를 가짐
app.use('/model-configs', modelConfigRoutes);
app.use('/mcp-servers', mcpServerRoutes);

// 에러 처리 미들웨어
app.use(errorMiddleware);

export default app;
