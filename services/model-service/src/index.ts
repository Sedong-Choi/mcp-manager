/**
 * Server entry point
 */
import dotenv from 'dotenv';
import { createApp } from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4001;

// Create and start server
const app = createApp();

app.listen(PORT, () => {
  console.log(`Model service is running on port ${PORT}`);
  console.log(`Using Ollama API at: ${process.env.OLLAMA_API_URL || 'http://localhost:11434'}`);
});
