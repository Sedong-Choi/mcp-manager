/**
 * Controller for model-related API endpoints
 */
import { Request, Response } from 'express';
import { ModelService } from '../services/modelService';
import { successResponse, errorResponse } from '../utils/responseFormatter';

export class ModelController {
  private modelService: ModelService;
  
  constructor(modelService: ModelService) {
    this.modelService = modelService;
  }

  /**
   * Get all available models
   */
  async getAllModels(req: Request, res: Response): Promise<void> {
    try {
      const models = await this.modelService.getAllModels();
      res.json(successResponse({ models }));
    } catch (error) {
      console.error('Error in getAllModels controller:', error);
      res.status(500).json(errorResponse(error as Error));
    }
  }

  /**
   * Get detailed information about a specific model
   */
  async getModelDetails(req: Request, res: Response): Promise<void> {
    const { modelName } = req.params;
    
    if (!modelName) {
      res.status(400).json(errorResponse('Model name is required'));
      return;
    }
    
    try {
      const model = await this.modelService.getModelDetails(modelName);
      res.json(successResponse({ model }));
    } catch (error) {
      console.error(`Error in getModelDetails controller for ${modelName}:`, error);
      
      // Determine appropriate status code
      const statusCode = (error as Error).message.includes('not found') ? 404 : 500;
      res.status(statusCode).json(errorResponse(error as Error));
    }
  }

  /**
   * Check a model's status
   */
  async getModelStatus(req: Request, res: Response): Promise<void> {
    const { modelName } = req.params;
    
    if (!modelName) {
      res.status(400).json(errorResponse('Model name is required'));
      return;
    }
    
    try {
      const status = await this.modelService.getModelStatus(modelName);
      res.json(successResponse(status));
    } catch (error) {
      console.error(`Error in getModelStatus controller for ${modelName}:`, error);
      
      // Determine appropriate status code
      const statusCode = (error as Error).message.includes('not found') ? 404 : 500;
      res.status(statusCode).json(errorResponse(error as Error));
    }
  }
}
