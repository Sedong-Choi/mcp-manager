import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
  OLLAMA_API_BASE_URL, 
  OLLAMA_API_TIMEOUT, 
  OLLAMA_API_RETRY_COUNT,
  OLLAMA_API_RETRY_DELAY
} from '../config/api';
import { 
  ListModelsResponse, 
  ModelInfoResponse, 
  OllamaErrorResponse,
  HealthResponse
} from '../types/ollama';

class OllamaClient {
  private client: AxiosInstance;
  private retryCount: number = OLLAMA_API_RETRY_COUNT;
  private retryDelay: number = OLLAMA_API_RETRY_DELAY;

  constructor() {
    this.client = axios.create({
      baseURL: OLLAMA_API_BASE_URL,
      timeout: OLLAMA_API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Response interceptor for handling errors
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        return this.handleRequestError(error);
      }
    );
  }

  private async handleRequestError(error: AxiosError): Promise<never> {
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;
    
    if (error.response) {
      // The request was made and the server responded with a status code
      statusCode = error.response.status;
      const errorData = error.response.data as OllamaErrorResponse;
      errorMessage = errorData.error || `Server responded with status: ${statusCode}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from Ollama server';
      statusCode = 503; // Service Unavailable
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }
    
    const enhancedError = new Error(`Ollama API Error: ${errorMessage}`);
    (enhancedError as any).status = statusCode;
    throw enhancedError;
  }

  // Retry mechanism for network issues
  private async retryRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.retryCount; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        // If this is not a network error or we've exhausted retries, throw
        if (!(error instanceof Error) || 
            attempt === this.retryCount || 
            (error as AxiosError).code !== 'ECONNABORTED') {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
    
    // This should never be reached due to the loop's throw condition
    throw lastError;
  }

  // Check if Ollama API is available
  async checkHealth(): Promise<HealthResponse> {
    try {
      // We'll use the list models endpoint as a health check
      await this.client.get('/api/tags');
      return { status: 'ok' };
    } catch (error) {
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get list of models
  async listModels(): Promise<ListModelsResponse> {
    return this.retryRequest(async () => {
      const response = await this.client.get('/api/tags');
      return response.data as ListModelsResponse;
    });
  }

  // Get model info
  async getModelInfo(modelName: string): Promise<ModelInfoResponse> {
    return this.retryRequest(async () => {
      const response = await this.client.get(`/api/show`, {
        params: { name: modelName }
      });
      return response.data as ModelInfoResponse;
    });
  }
}

export default OllamaClient;
