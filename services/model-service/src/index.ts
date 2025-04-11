import dotenv from 'dotenv';
import { createApp } from './app';  // '@/app' 대신 상대 경로 사용

// 환경 변수 로드
dotenv.config();

const PORT = process.env.PORT || 4001;

async function startServer() {
  try {
    const app = createApp();

    app.listen(PORT, () => {
      console.log(`✅ Model service running on port ${PORT}`);
      console.log(`🔗 Connected to Ollama API at ${process.env.OLLAMA_API_URL || 'http://localhost:11434'}`);
      console.log(`💡 Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start model service:', error);
    process.exit(1);
  }
}

startServer();
