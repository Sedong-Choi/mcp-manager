import dotenv from 'dotenv';
import app from './app';
import migration from './migrations/migration';

// 환경 변수 설정
dotenv.config();

const port = process.env.PORT || 4004;

// 서버 시작 함수
const startServer = async () => {
  try {
    // 마이그레이션 실행
    console.log('Running database migrations...');
    const migrationsRun = await migration.runMigrations();
    console.log(`${migrationsRun} migrations applied.`);

    // 서버 시작
    app.listen(port, () => {
      console.log(`Database service running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// 서버 시작
startServer();
