import { Router } from 'express';
import OllamaClient from '../lib/ollamaClient';
import { apiResponse, asyncHandler } from '../utils/errorHandler';

const router = Router();
const ollamaClient = new OllamaClient();

// Server health check endpoint
router.get('/', (req, res) => {
  return apiResponse(res, { status: 'ok', service: 'model-service' });
});

// Ollama API health check endpoint
router.get('/ollama', asyncHandler(async (req, res) => {
  const health = await ollamaClient.checkHealth();
  return apiResponse(res, health);
}));

export default router;
