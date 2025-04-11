/**
 * Model management API routes
 */
import express, { Router } from 'express';
import { ModelController } from '../controllers/modelController';

export function createModelRouter(modelController: ModelController): Router {
  const router = express.Router();

  // Get all models
  router.get('/', (req, res) => modelController.getAllModels(req, res));
  
  // Get specific model's status
  router.get('/:modelName/status', (req, res) => modelController.getModelStatus(req, res));
  
  // Get specific model details
  router.get('/:modelName', (req, res) => modelController.getModelDetails(req, res));

  return router;
}
