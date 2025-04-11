/**
 * Express application setup
 */
import express,{Express} from 'express';
import cors from 'cors';
import { OllamaClient } from './lib/ollamaClient';
import { createHealthRouter } from './routes/healthRoute';
import { ModelService } from './services/modelService';
import { ModelController } from './controllers/modelController';
import { createModelRouter } from './routes/modelRoutes';

// Create express app
const app:Express = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Create clients and services
const ollamaClient = new OllamaClient();
const modelService = new ModelService(ollamaClient);
const modelController = new ModelController(modelService);

// Register routes
app.use('/health', createHealthRouter(ollamaClient));
app.use('/api/v1/models', createModelRouter(modelController));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

export default app;
