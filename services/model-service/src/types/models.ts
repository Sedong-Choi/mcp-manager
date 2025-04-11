/**
 * Model related type definitions
 */

// Basic model information type
export interface ModelInfo {
  name: string;
  size: number;
  modified: string;
  family?: string;
  format?: string;
  quantization?: string;
}

// Model status
export enum ModelStatus {
  LOADED = 'loaded',
  UNLOADED = 'unloaded',
  LOADING = 'loading',
  ERROR = 'error',
}

// Model detailed info
export interface ModelDetails extends ModelInfo {
  status?: ModelStatus;
  parameters?: Record<string, any>;
  template?: string;
  license?: string;
  system?: string;
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
