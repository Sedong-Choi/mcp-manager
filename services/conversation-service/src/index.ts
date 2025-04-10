import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/conversations', (req, res) => {
  res.json({
    conversations: [
      { id: '1', title: '첫 번째 대화', createdAt: new Date().toISOString() },
      { id: '2', title: '두 번째 대화', createdAt: new Date().toISOString() }
    ]
  });
});

app.listen(port, () => {
  console.log(`Conversation service running on port ${port}`);
});
