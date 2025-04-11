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
      expect(response.data.status).toBe('ok');
    } catch (error) {
      // Skip test if Ollama is not available
      if (error.code === 'ECONNREFUSED') {
        console.warn('Ollama API is not available, skipping test');
      } else {
        throw error;
      }
    }
  });

  // Commented out until API is fully implemented
  // it('should retrieve model list from Ollama', async () => {
  //   const response = await axios.get(`${MODEL_SERVICE_URL}/api/v1/models`);
  //   expect(response.status).toBe(200);
  //   expect(response.data.success).toBe(true);
  //   expect(response.data.data.models).toBeDefined();
  //   expect(Array.isArray(response.data.data.models)).toBe(true);
  // });
});
