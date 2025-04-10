import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/models', (req, res) => {
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
