import modelService from '../../src/services/modelService';
import { exec } from 'child_process';
import util from 'util';

// Correctly mock util.promisify to return a function that returns the expected shape
const mockExecFn = jest.fn();
jest.mock('util', () => ({
  promisify: jest.fn(() => mockExecFn)
}));

// Mock OllamaClient import to avoid axios-related errors
jest.mock('../../src/lib/ollamaClient', () => ({
  OllamaClient: jest.fn().mockImplementation(() => ({
    getModelInfo: jest.fn().mockResolvedValue({ modelfile: '', parameters: {}, template: '', license: '' }),
    checkModelLoaded: jest.fn().mockResolvedValue(void 0)
  }))
}));

const mockExec = mockExecFn;

describe('modelService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('downloadModel', () => {
    it('should download the model successfully', async () => {
      mockExec.mockResolvedValueOnce({ stdout: 'Download successful', stderr: '' });

      const result = await modelService.downloadModel('test-model');

      expect(result).toBe('Download successful');
      expect(mockExec).toHaveBeenCalledWith('ollama pull test-model');
    });

    it('should throw an error if the download fails', async () => {
      mockExec.mockRejectedValueOnce(new Error('Download failed'));

      await expect(modelService.downloadModel('test-model')).rejects.toThrow('Failed to download model: Download failed');
    });
  });

  describe('loadModel', () => {
    it('should load the model successfully', async () => {
      mockExec.mockResolvedValueOnce({ stdout: 'Loading model...\nModel loaded successfully', stderr: '' });

      const result = await modelService.loadModel('test-model');

      expect(result).toContain('test-model loaded successfully');
      expect(mockExec).toHaveBeenCalledWith('ollama run test-model "exit" --verbose');
    });

    it('should throw an error if the load fails', async () => {
      mockExec.mockRejectedValueOnce(new Error('Model not found'));

      await expect(modelService.loadModel('test-model')).rejects.toThrow('Failed to load model: Model not found');
    });
  });

  describe('unloadModel', () => {
    it('should unload the model successfully', async () => {
      mockExec.mockResolvedValueOnce({ stdout: '', stderr: '' });

      const result = await modelService.unloadModel('test-model');

      expect(result).toContain('test-model unloaded successfully');
      expect(mockExec).toHaveBeenCalledWith('pkill -f "ollama run test-model"');
    });

    it('should handle case when no model instances are running', async () => {
      const error = new Error('No processes found');
      error.code = 1;
      mockExec.mockRejectedValueOnce(error);

      const result = await modelService.unloadModel('test-model');

      expect(result).toContain('No running instances of test-model found');
    });

    it('should throw an error for other unload failures', async () => {
      mockExec.mockRejectedValueOnce(new Error('Permission denied'));

      await expect(modelService.unloadModel('test-model')).rejects.toThrow('Failed to unload model: Permission denied');
    });
  });
});