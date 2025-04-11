/**
 * Express app configuration
 */
import express, { Express } from 'express';
import cors from 'cors';
import { OllamaClient } from './lib/ollamaClient';
import { ModelService } from './services/modelService';
import { ModelController } from './controllers/modelController';
import { createHealthRouter } from './routes/healthRoute';
import { createModelRouter } from './routes/modelRoutes';
import { errorMiddleware } from './utils/errorHandler';

export function createApp(): Express {
  // Initialize dependencies
  const ollamaClient = new OllamaClient();
  const modelService = new ModelService(ollamaClient);
  const modelController = new ModelController(modelService);

  // Create Express app
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/health', createHealthRouter(ollamaClient));
  app.use('/api/v1/models', createModelRouter(modelController));

  // Error handling
  app.use(errorMiddleware);

  return app;
}
