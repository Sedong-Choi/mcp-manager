import { Router } from 'express';
import { downloadModel } from '../controllers/modelController';

const router = Router();

router.post('/models/:modelName/download', downloadModel);

export default router;