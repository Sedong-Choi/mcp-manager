/**
 * Unit tests for the model service
 */
import { ModelService } from '@/services/modelService';
import { OllamaClient } from '@/lib/ollamaClient';
import { ModelStatus } from '@/types/models';
import { ModelInfoResponse, OllamaModel } from '@/types/ollama';

// Mock the OllamaClient
jest.mock('@/lib/ollamaClient');

describe('ModelService', () => {
  let modelService: ModelService;
  let mockOllamaClient: jest.Mocked<OllamaClient>;
  let originalConsoleError: jest.SpyInstance;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock console.error to prevent logs during tests
    originalConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Create a mock instance of OllamaClient
    mockOllamaClient = new OllamaClient() as jest.Mocked<OllamaClient>;
    
    // Create a new instance of ModelService with the mock client
    modelService = new ModelService(mockOllamaClient);
  });

  afterEach(() => {
    // Restore console.error after each test
    originalConsoleError.mockRestore();
  });

  describe('getAllModels', () => {
    it('should return a list of models', async () => {
      // Mock the response from listModels
      const mockModels:{models:OllamaModel[]} = {
        models: [
          {
              name: 'llama2', size: 3900000000, modified_at: '2023-08-01',
              digest: ''
          },
          {
              name: 'mistral', size: 4200000000, modified_at: '2023-09-15',
              digest: ''
          }
        ]
      };
      mockOllamaClient.listModels.mockResolvedValue(mockModels);
      
      // Call the method
      const result = await modelService.getAllModels();
      
      // Verify the result
      expect(result).toEqual(mockModels.models);
      expect(mockOllamaClient.listModels).toHaveBeenCalledTimes(1);
    });

    it('should handle errors properly', async () => {
      // Mock an error response
      const errorMessage = 'Network error';
      mockOllamaClient.listModels.mockRejectedValue(new Error(errorMessage));
      
      // Call the method and expect it to throw
      await expect(modelService.getAllModels())
        .rejects
        .toThrow('Failed to fetch models');
      
      expect(mockOllamaClient.listModels).toHaveBeenCalledTimes(1);
    });
  });

  describe('getModelDetails', () => {
    it('should return details for a specific model', async () => {
      // Mock the response from getModelInfo
      const mockModelInfo:ModelInfoResponse = {
        name: 'llama2',
        size: 3900000000,
        modified_at: '2023-08-01',
        format: 'gguf',
        family: 'llama',
        quantization: 'Q4_0',
        parameters: { contextLength: 4096 },
        template: '{{ prompt }}'
      };
      
      // Mock the status check
      const mockStatus = {
        name: 'llama2',
        status: ModelStatus.LOADED
      };
      
      mockOllamaClient.getModelInfo.mockResolvedValue(mockModelInfo);
      mockOllamaClient.listModels.mockResolvedValue({
        models: [{
            name: 'llama2', size: 3900000000, modified_at: '2023-08-01',
            digest: ''
        }]
      });
      mockOllamaClient.checkModelLoaded.mockResolvedValue(undefined);
      
      // Call the method
      const result = await modelService.getModelDetails('llama2');
      
      // Verify the result
      expect(result).toEqual({
        ...mockModelInfo,
        status: ModelStatus.LOADED
      });
      expect(mockOllamaClient.getModelInfo).toHaveBeenCalledWith('llama2');
    });
  });

  describe('getModelStatus', () => {
    it('should return loaded status for a loaded model', async () => {
      // Mock responses
      mockOllamaClient.listModels.mockResolvedValue({
        models: [{ 
          name: 'llama2', 
          size: 3900000000, 
          modified_at: '2023-08-01',
          digest: 'sha256:abc123' 
        }]
      });
      mockOllamaClient.checkModelLoaded.mockResolvedValue(undefined);
      
      // Call the method
      const result = await modelService.getModelStatus('llama2');
      
      // Verify the result
      expect(result).toEqual({
        name: 'llama2',
        status: ModelStatus.LOADED
      });
    });

    it('should return unloaded status for an unloaded model', async () => {
      // Mock responses
      mockOllamaClient.listModels.mockResolvedValue({
        models: [{ 
          name: 'llama2', 
          size: 3900000000, 
          modified_at: '2023-08-01',
          digest: 'sha256:abc123' 
        }]
      });
      
      // Mock the error indicating model is not loaded
      const notLoadedError = new Error('Model llama2 is not loaded');
      mockOllamaClient.checkModelLoaded.mockRejectedValue(notLoadedError);
      
      // Call the method
      const result = await modelService.getModelStatus('llama2');
      
      // Verify the result
      expect(result).toEqual({
        name: 'llama2',
        status: ModelStatus.UNLOADED
      });
    });

    it('should handle non-existent models', async () => {
      // Mock responses - no models with this name
      mockOllamaClient.listModels.mockResolvedValue({
        models: [{ 
          name: 'llama2', 
          size: 3900000000, 
          modified_at: '2023-08-01',
          digest: 'sha256:abc123' 
        }]
      });
      
      // Call the method
      const result = await modelService.getModelStatus('non-existent-model');
      
      // Verify the result
      expect(result).toEqual({
        name: 'non-existent-model',
        status: ModelStatus.ERROR,
        message: 'Model not found'
      });
    });
  });
});
