/**
 * Types related to model management
 */

// Model loading status
export enum ModelStatus {
  LOADED = 'loaded',
  UNLOADED = 'unloaded',
  LOADING = 'loading',
  ERROR = 'error'
}

// Basic model information
export interface ModelInfo {
  name: string;
  size: number;
  modified_at: string;
  digest: string;
}

// Extended model details
export interface ModelDetails {
  name: string;
  size: number;
  modified_at: string;
  format?: string;
  family?: string;
  quantization?: string;
  parameters?: Record<string, any>;
  template?: string;
  status: ModelStatus;
  message?: string;
}

// API Response types
export interface ListModelsResponse {
  models: ModelInfo[];
}

export interface ModelDetailsResponse {
  model: ModelDetails;
}

export interface ModelStatusResponse {
  name: string;
  status: ModelStatus;
  message?: string;
}
