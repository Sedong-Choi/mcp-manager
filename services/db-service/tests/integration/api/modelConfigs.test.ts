import supertest from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { ModelConfig } from '../../../src/models/interfaces';

// Mock data store
let modelConfigsStore: Partial<ModelConfig>[] = [];

// Mock database functions
const mockDB = {
  select: jest.fn().mockImplementation(() => mockDB),
  where: jest.fn().mockImplementation(() => mockDB),
  insert: jest.fn().mockImplementation((data) => {
    if (Array.isArray(data)) {
      modelConfigsStore.push(...data);
    } else {
      modelConfigsStore.push(data);
    }
    return Promise.resolve([data.id || '1']);
  }),
  update: jest.fn().mockImplementation((data) => {
    const index = modelConfigsStore.findIndex(item => item.id === data.id);
    if (index !== -1) {
      modelConfigsStore[index] = { ...modelConfigsStore[index], ...data };
    }
    return Promise.resolve(1);
  }),
  del: jest.fn().mockImplementation(() => {
    modelConfigsStore = [];
    return Promise.resolve(modelConfigsStore.length);
  }),
  then: jest.fn().mockImplementation((callback) => {
    return Promise.resolve(callback(modelConfigsStore));
  })
};

// Mock database
jest.mock('../../../src/config/database', () => {
  return jest.fn().mockImplementation(() => mockDB);
});

// Import the app after mocking
import app from '../../../src/app';
const request = supertest(app);

describe('Model Config API', () => {
  beforeEach(() => {
    // Clear mock data and reset mock functions
    modelConfigsStore = [];
    jest.clearAllMocks();
    
    // Setup default implementation for select
    mockDB.select.mockImplementation(() => {
      return Promise.resolve(modelConfigsStore);
    });
  });
  
  describe('GET /model-configs', () => {
    it('should return empty array when no models exist', async () => {
      const response = await request.get('/model-configs');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    
    it('should return all model configs', async () => {
      // Add test data to mock store
      const modelConfig: Partial<ModelConfig> = {
        id: uuidv4(),
        model_name: 'test-model',
        api_port: 11434,
        status: 'stopped',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      modelConfigsStore.push(modelConfig);
      
      const response = await request.get('/model-configs');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].model_name).toBe('test-model');
    });
  });
  
  // Add more integration tests for POST, PUT, PATCH, DELETE
});
