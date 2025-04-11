import { Router, Request, Response } from 'express';
import { type Router as RouterType } from 'express';
import OllamaClient from '@/lib/ollamaClient';
import { apiResponse, asyncHandler } from '@/utils/errorHandler';

const router: RouterType = Router();
const ollamaClient = new OllamaClient();

// Server health check endpoint
router.get('/', (req: Request, res: Response) => {
  return apiResponse(res, { status: 'ok', service: 'model-service' });
});

// Ollama API health check endpoint
router.get('/ollama', asyncHandler(async (req: Request, res: Response) => {
  const health = await ollamaClient.checkHealth();
  return apiResponse(res, health);
}));

export default router;
