import axios, { AxiosInstance, AxiosResponse } from 'axios';
import OllamaClient from '@/lib/ollamaClient';
import { ListModelsResponse, ModelInfoResponse } from '@/types/ollama';

// axios mock 타입 명확하게 정의
interface MockAxiosInstance {
  get: jest.Mock;
  interceptors: {
    response: {
      use: jest.Mock;
    };
  };
}

jest.mock('axios', () => {
  return {
    create: jest.fn().mockReturnValue({
      get: jest.fn(),
      interceptors: {
        response: {
          use: jest.fn()
        }
      }
    })
  };
});

describe('OllamaClient', () => {
  let client: OllamaClient;
  let mockAxios: MockAxiosInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new OllamaClient();
    // 타입 캐스팅 명확히 처리
    mockAxios = (axios.create as jest.MockedFunction<typeof axios.create>)() as unknown as MockAxiosInstance;
  });

  describe('checkHealth', () => {
    it('should return ok status when API is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: { models: [] } } as AxiosResponse);
      
      const result = await client.checkHealth();
      
      expect(result).toEqual({ status: 'ok' });
      expect(mockAxios.get).toHaveBeenCalledWith('/api/tags');
    });

    it('should return error status when API is not available', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Connection refused'));
      
      const result = await client.checkHealth();
      
      expect(result.status).toBe('error');
      expect(result.message).toContain('Connection refused');
    });
  });

  describe('listModels', () => {
    it('should return list of models', async () => {
      const mockResponse = { 
        data: { 
          models: [
            { name: 'model1', size: 1000, modified_at: '2023-01-01', digest: 'abc123' },
            { name: 'model2', size: 2000, modified_at: '2023-01-02', digest: 'def456' }
          ] 
        } 
      };
      mockAxios.get.mockResolvedValueOnce(mockResponse as AxiosResponse);
      
      const result = await client.listModels();
      
      expect(result).toEqual(mockResponse.data);
      expect(mockAxios.get).toHaveBeenCalledWith('/api/tags');
    });
  });

  describe('getModelInfo', () => {
    it('should return model information', async () => {
      const modelName = 'model1';
      const mockResponse = { 
        data: { 
          name: modelName, 
          size: 1000, 
          modified_at: '2023-01-01', 
          digest: 'sha256:abc123',
          format: 'gguf',
          family: 'llama',
          quantization: 'Q4_0',
          details: {
            format: 'gguf',
            family: 'llama',
            parameter_size: '7B',
            quantization_level: 'Q4_0'
          }
        } 
      };
      mockAxios.get.mockResolvedValueOnce(mockResponse as AxiosResponse);
      
      const result = await client.getModelInfo(modelName);
      
      expect(result).toEqual(mockResponse.data);
      expect(mockAxios.get).toHaveBeenCalledWith('/api/show', {
        params: { name: modelName }
      });
    });
  });
});
