import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db';
import path from 'path';

// 라우터 임포트
import conversationsRouter from './routes/conversations';
import messagesRouter from './routes/messages';
import modelConfigsRouter from './routes/modelConfigs';
import mcpServersRouter from './routes/mcpServers';

// 환경변수 설정 로드
dotenv.config();

// Express 앱 초기화
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 마이그레이션 실행
const runMigrations = async () => {
  try {
    // __dirname이 dist 폴더를 가리키므로 migrations 경로를 정확히 지정
    await db.migrate.latest({
      directory: path.join(__dirname, 'migrations')
    });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MCP Manager Pro DB Service API' });
});

// 라우터 설정
app.use('/conversations', conversationsRouter);
app.use('/', messagesRouter); // message routes include the conversation id in the path
app.use('/model-configs', modelConfigsRouter);
app.use('/mcp-servers', mcpServersRouter);

// 서버 시작
const startServer = async () => {
  await runMigrations();
  
  app.listen(PORT, () => {
    console.log(`DB Service running on http://localhost:${PORT}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
