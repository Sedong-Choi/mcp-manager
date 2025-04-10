import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/servers', (req, res) => {
  res.json({
    servers: [
      { id: '1', name: 'local-mcp', status: 'stopped', port: 8080 },
      { id: '2', name: 'cloud-mcp', status: 'stopped', port: 8081 }
    ]
  });
});

app.listen(port, () => {
  console.log(`MCP service running on port ${port}`);
});
