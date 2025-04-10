// Configuration for the Ollama API
export const OLLAMA_API_BASE_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
export const OLLAMA_API_TIMEOUT = parseInt(process.env.OLLAMA_API_TIMEOUT || '10000');
export const OLLAMA_API_RETRY_COUNT = parseInt(process.env.OLLAMA_API_RETRY_COUNT || '3');
export const OLLAMA_API_RETRY_DELAY = parseInt(process.env.OLLAMA_API_RETRY_DELAY || '1000');
