/**
 * Model API routes
 */
import express, { Router } from 'express';
import { ModelController } from '../controllers/modelController';
import { asyncHandler } from '../utils/errorHandler';

export function createModelRouter(modelController: ModelController): Router {
  const router = express.Router();

  // Get all models
  router.get('/', asyncHandler(modelController.getAllModels.bind(modelController)));

  // Get model details by name
  router.get('/:modelName', asyncHandler(modelController.getModelDetails.bind(modelController)));

  // Get model status
  router.get('/:modelName/status', asyncHandler(modelController.getModelStatus.bind(modelController)));

  return router;
}
