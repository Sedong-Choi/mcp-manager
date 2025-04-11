import modelService from '../../src/services/modelService';
import { exec } from 'child_process';
import util from 'util';

jest.mock('util', () => ({
  promisify: jest.fn(() => jest.fn()),
}));

const mockExec = util.promisify(exec);

describe('modelService', () => {
  describe('downloadModel', () => {
    it('should download the model successfully', async () => {
      mockExec.mockResolvedValueOnce({ stdout: 'Download successful' });

      const result = await modelService.downloadModel('test-model');

      expect(result).toBe('Download successful');
      expect(mockExec).toHaveBeenCalledWith('ollama pull test-model');
    });

    it('should throw an error if the download fails', async () => {
      mockExec.mockRejectedValueOnce(new Error('Download failed'));

      await expect(modelService.downloadModel('test-model')).rejects.toThrow('Failed to download model: Download failed');
    });
  });
});