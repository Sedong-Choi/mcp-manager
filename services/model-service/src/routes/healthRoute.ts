/**
 * Health check API routes
 */
import express, { Router, Request, Response } from 'express';
import { OllamaClient } from '../lib/ollamaClient';

export function createHealthRouter(ollamaClient: OllamaClient): Router {
  const router = express.Router();

  // Basic health check endpoint
  router.get('/', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'model-service',
      timestamp: new Date().toISOString()
    });
  });

  // Ollama API health check endpoint
  router.get('/ollama', async (req: Request, res: Response) => {
    try {
      const isOllamaAvailable = await ollamaClient.ping();
      
      if (isOllamaAvailable) {
        res.json({
          status: 'ok',
          message: 'Ollama API is available',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          status: 'error',
          message: 'Ollama API is not available',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error checking Ollama API health',
        error: (error as Error).message,
        timestamp: new Date().toISOString()
      });
    }
  });

  return router;
}
