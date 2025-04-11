/**
 * Types for Ollama API
 */

export interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
  digest: string;
}

export interface ListModelsResponse {
  models: OllamaModel[];
}

export interface ModelInfoResponse {
  name: string;
  size: number;
  modified_at: string;
  format?: string;
  family?: string;
  quantization?: string;
  parameters?: Record<string, any>;
  template?: string;
}

export interface OllamaErrorResponse {
  error?: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  message?: string;
}
