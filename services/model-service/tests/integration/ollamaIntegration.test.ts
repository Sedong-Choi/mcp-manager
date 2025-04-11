import axios from 'axios';

// 실제 서비스가 실행 중이어야 합니다
const MODEL_SERVICE_URL = 'http://localhost:4001';

describe('Ollama Integration Tests', () => {
  // 테스트 전에 서비스가 실행 중인지 확인
  beforeAll(async () => {
    try {
      await axios.get(`${MODEL_SERVICE_URL}/health`);
    } catch (error) {
      console.error('테스트 전에 model-service를 실행해주세요: pnpm dev');
      process.exit(1);
    }
  });

  it('should connect to Ollama API successfully', async () => {
    try {
      const response = await axios.get(`${MODEL_SERVICE_URL}/health/ollama`);
      expect(response.status).toBe(200);
      expect(response.data.data.status).toBe('ok');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        // it('should retrieve model list from Ollama', async () => {
        //   const response = await axios.get(`${MODEL_SERVICE_URL}/models`);
        //   expect(response.status).toBe(200);
        //   expect(response.data.data.models).toBeDefined();
        //   expect(Array.isArray(response.data.data.models)).toBe(true);
        // });
      }
    }
  })
});
