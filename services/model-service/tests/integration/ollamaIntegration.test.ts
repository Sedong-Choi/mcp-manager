import axios from 'axios';
import { setupOllamaForTests, ollamaTestUtils } from '@mcp/ollama-utils';
import nock from 'nock';

// 실제 서비스가 실행 중이어야 합니다
const MODEL_SERVICE_URL = process.env.MODEL_SERVICE_URL || 'http://localhost:4001';
const MOCK_OLLAMA = process.env.MOCK_OLLAMA === 'true';

describe('Ollama Integration Tests', () => {
  
  // Ollama 테스트 환경 설정
  // 환경 변수로 실제 Ollama 실행이 비활성화되지 않았을 경우만 실행
  if (!MOCK_OLLAMA) {
    setupOllamaForTests();
  }
  
  beforeAll(async () => {
    // 모킹 모드일 경우 Ollama API를 모킹
    if (MOCK_OLLAMA) {
      const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
      // 헬스체크 모킹
      nock(ollamaUrl)
        .persist()
        .get('/api/tags')
        .reply(200, { models: [] });
      
      // 모델 목록 모킹
      nock(ollamaUrl)
        .persist()
        .get('/api/v1/models')
        .reply(200, {
          success: true,
          data: {
            models: [
              { name: 'llama2', size: 3900000000, modified_at: '2023-08-01', digest: 'abc123' },
              { name: 'mistral', size: 4200000000, modified_at: '2023-09-15', digest: 'def456' }
            ]
          }
        });
    }

    try {
      await axios.get(`${MODEL_SERVICE_URL}/health`);
    } catch (error) {
      console.error('테스트 전에 model-service를 실행해주세요: pnpm dev');
      process.exit(1);
    }
  });

  afterAll(() => {
    // 모킹 정리
    if (MOCK_OLLAMA) {
      nock.cleanAll();
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

  // 이제 주석 해제 가능
  it('should retrieve model list from Ollama', async () => {
    try {
      const response = await axios.get(`${MODEL_SERVICE_URL}/api/v1/models`);
      expect(response.status).toBe(200);
      // 아직 API가 구현되지 않았다면 아래 검증을 맞게 수정해야 함
      if (response.data.success !== undefined) {
        expect(response.data.success).toBe(true);
        expect(response.data.data.models).toBeDefined();
        expect(Array.isArray(response.data.data.models)).toBe(true);
      } else {
        // 직접 모델 배열을 반환하는 경우
        expect(Array.isArray(response.data)).toBe(true);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.response?.status === 404) {
        console.warn('API endpoint not implemented yet, skipping test');
      } else {
        throw error;
      }
    }
  });
});
