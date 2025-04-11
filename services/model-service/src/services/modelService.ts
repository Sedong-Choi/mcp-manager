import { exec } from 'child_process';
import util from 'util';
import { OllamaClient } from '../lib/ollamaClient';

const execPromise = util.promisify(exec);

export class ModelService {
  private ollamaClient: OllamaClient;

  constructor(ollamaClient: OllamaClient) {
    this.ollamaClient = ollamaClient;
  }

  async downloadModel(modelName: string): Promise<string> {
    try {
      const { stdout } = await execPromise(`ollama pull ${modelName}`);
      return stdout;
    } catch (error) {
      throw new Error(`Failed to download model: ${error.message}`);
    }
  }

  async loadModel(modelName: string): Promise<string> {
    try {
      // First check if the model exists
      await this.ollamaClient.getModelInfo(modelName);
      
      // Then make a minimal request to load the model
      // Ollama loads models on first use, so we send a minimal request
      const { stdout } = await execPromise(`ollama run ${modelName} "exit" --verbose`);
      return `Model ${modelName} loaded successfully`;
    } catch (error) {
      throw new Error(`Failed to load model: ${error.message}`);
    }
  }

  async unloadModel(modelName: string): Promise<string> {
    try {
      // First verify the model exists
      await this.ollamaClient.getModelInfo(modelName);
      
      // Currently Ollama doesn't have a direct API for unloading models
      // In real implementation, this would call the Ollama API when available
      const { stdout } = await execPromise(`pkill -f "ollama run ${modelName}"`);
      return `Model ${modelName} unloaded successfully`;
    } catch (error) {
      // pkill returns non-zero exit code if no processes found, which isn't an error for us
      if (error.code === 1) {
        return `No running instances of model ${modelName} found`;
      }
      throw new Error(`Failed to unload model: ${error.message}`);
    }
  }

  async isModelRunning(modelName: string): Promise<boolean> {
    try {
      await this.ollamaClient.checkModelLoaded(modelName);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// For backward compatibility with existing code
export default {
  downloadModel: (modelName: string) => new ModelService(new OllamaClient()).downloadModel(modelName),
  loadModel: (modelName: string) => new ModelService(new OllamaClient()).loadModel(modelName),
  unloadModel: (modelName: string) => new ModelService(new OllamaClient()).unloadModel(modelName)
};