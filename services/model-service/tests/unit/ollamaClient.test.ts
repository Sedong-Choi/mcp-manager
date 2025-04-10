import axios from 'axios';
import OllamaClient from '../../src/lib/ollamaClient';

// Mock axios
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
  let mockAxios: any;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new OllamaClient();
    mockAxios = (axios.create as jest.Mock)();
  });

  describe('checkHealth', () => {
    it('should return ok status when API is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: { models: [] } });
      
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
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      
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
          digest: 'abc123',
          details: {
            format: 'gguf',
            family: 'llama',
            parameter_size: '7B',
            quantization_level: 'Q4_0'
          }
        } 
      };
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      
      const result = await client.getModelInfo(modelName);
      
      expect(result).toEqual(mockResponse.data);
      expect(mockAxios.get).toHaveBeenCalledWith('/api/show', {
        params: { name: modelName }
      });
    });
  });
});
