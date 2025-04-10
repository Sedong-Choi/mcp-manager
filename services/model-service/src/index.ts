import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// Define interfaces for type safety
interface ModelResponse {
  models: Model[];
}

interface Model {
  name: string;
  status: 'running' | 'stopped';
}

interface HealthResponse {
  status: string;
}

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response<HealthResponse>) => {
  res.json({ status: 'ok' });
});

app.get('/models', (req: Request, res: Response<ModelResponse>) => {
  res.json({
    models: [
      { name: 'gemma-2b', status: 'stopped' },
      { name: 'llama2', status: 'stopped' }
    ]
  });
});

app.listen(port, () => {
  console.log(`Model service running on port ${port}`);
});
