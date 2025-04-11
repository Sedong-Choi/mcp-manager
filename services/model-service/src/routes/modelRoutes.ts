import { Router } from 'express';
import { ModelController } from '../controllers/modelController';
import { downloadModel, loadModel, unloadModel } from '../controllers/modelController';

// Function to create the router with a controller instance
export function createModelRouter(modelController: ModelController): Router {
  const router = Router();
  
  // Bind controller methods to retain 'this' context
  router.post('/:modelName/download', (req, res) => modelController.downloadModel(req, res));
  router.post('/:modelName/load', (req, res) => modelController.loadModel(req, res));
  router.post('/:modelName/unload', (req, res) => modelController.unloadModel(req, res));
  
  return router;
}

// Default router using functional approach for backward compatibility
const router = Router();

router.post('/models/:modelName/download', downloadModel);
router.post('/models/:modelName/load', loadModel);
router.post('/models/:modelName/unload', unloadModel);

export default router;