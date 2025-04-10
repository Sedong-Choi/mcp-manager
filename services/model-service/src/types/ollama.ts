// Type definitions for Ollama API

// Model information interface
export interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
  digest: string;
  details?: OllamaModelDetails;
}

export interface OllamaModelDetails {
  format: string;
  family: string;
  parameter_size: string;
  quantization_level?: string;
}

// API response types
export interface ListModelsResponse {
  models: OllamaModel[];
}

export interface ModelInfoResponse extends OllamaModel {}

export interface OllamaErrorResponse {
  error: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  message?: string;
}

// API request types
export interface PullModelRequest {
  name: string;
  stream?: boolean;
}
