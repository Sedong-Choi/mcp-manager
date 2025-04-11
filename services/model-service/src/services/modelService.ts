/**
 * Model Service for handling Ollama model operations
 */
import { AxiosError } from 'axios';
import { OllamaClient } from '@/lib/ollamaClient';
import { ModelDetails, ModelInfo, ModelStatus } from '@/types/models';

export class ModelService {
  private ollamaClient: OllamaClient;
  
  constructor(ollamaClient: OllamaClient) {
    this.ollamaClient = ollamaClient;
  }

  /**
   * Get all available models
   */
  async getAllModels(): Promise<ModelInfo[]> {
    try {
      // TODO - 통합된 API로 변경 필요
      const response = await this.ollamaClient.listModels();
      return response.models;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw this.handleModelError(error, 'Failed to fetch models');
    }
  }

  /**
   * Get detailed information about a specific model
   */
  async getModelDetails(modelName: string): Promise<ModelDetails> {
    try {
      const response = await this.ollamaClient.getModelInfo(modelName);
      
      // Check if the model is currently loaded
      const status = await this.getModelStatus(modelName);
      
      return {
        ...response,
        status: status.status
      };
    } catch (error) {
      console.error(`Error fetching model details for ${modelName}:`, error);
      throw this.handleModelError(error, `Failed to fetch details for model ${modelName}`);
    }
  }

  /**
   * Check model status (loaded/unloaded)
   */
  async getModelStatus(modelName: string): Promise<{ name: string; status: ModelStatus; message?: string }> {
    try {
      // First check if model exists
      const allModels = await this.ollamaClient.listModels();
      const modelExists = allModels.models.some(model => model.name === modelName);
      
      if (!modelExists) {
        return {
          name: modelName,
          status: ModelStatus.ERROR,
          message: 'Model not found'
        };
      }
      
      // Try to quickly check model status (this is an approximation as Ollama doesn't have a direct status check)
      try {
        await this.ollamaClient.checkModelLoaded(modelName);
        return {
          name: modelName,
          status: ModelStatus.LOADED
        };
      } catch (error) {
        // If we get a specific error that indicates the model is not loaded
        if (error instanceof Error && error.message.includes('not loaded')) {
          return {
            name: modelName,
            status: ModelStatus.UNLOADED
          };
        }
        
        // For other errors, we're not sure about the status
        return {
          name: modelName,
          status: ModelStatus.ERROR,
          message: 'Could not determine model status'
        };
      }
    } catch (error) {
      console.error(`Error checking status for model ${modelName}:`, error);
      throw this.handleModelError(error, `Failed to check status for model ${modelName}`);
    }
  }

  /**
   * Handle model operation errors
   */
  private handleModelError(error: unknown, defaultMessage: string): Error {
    if (error instanceof AxiosError && error.response) {
      return new Error(
        error.response.data.error || 
        `${defaultMessage}: ${error.response.status} ${error.response.statusText}`
      );
    }
    
    if (error instanceof Error) {
      return new Error(`${defaultMessage}: ${error.message}`);
    }
    
    return new Error(defaultMessage);
  }
}
