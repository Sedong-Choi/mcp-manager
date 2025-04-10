import supertest from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { ModelConfig } from '@//models/interfaces';

// Mock data store
let modelConfigsStore: Partial<ModelConfig>[] = [];

// Mock database functions
const mockDB = {
  select: jest.fn().mockImplementation(() => mockDB),
  where: jest.fn().mockImplementation((condition) => {
    // Support for where queries
    if (condition.id) {
      mockDB.singleItem = modelConfigsStore.find(item => item.id === condition.id);
    } else if (condition.model_name) {
      mockDB.singleItem = modelConfigsStore.find(item => item.model_name === condition.model_name);
    }
    mockDB.currentId = condition.id;
    return mockDB;
  }),
  first: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockDB.singleItem);
  }),
  orderBy: jest.fn().mockImplementation(() => mockDB),
  insert: jest.fn().mockImplementation((data) => {
    if (Array.isArray(data)) {
      modelConfigsStore.push(...data);
    } else {
      modelConfigsStore.push(data);
    }
    return Promise.resolve([data.id || '1']);
  }),
  update: jest.fn().mockImplementation((data) => {
    const index = modelConfigsStore.findIndex(item => item.id === mockDB.currentId);
    if (index !== -1) {
      modelConfigsStore[index] = { ...modelConfigsStore[index], ...data };
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  del: jest.fn().mockImplementation(() => {
    const initialLength = modelConfigsStore.length;
    modelConfigsStore = modelConfigsStore.filter(item => item.id !== mockDB.currentId);
    const deleted = initialLength - modelConfigsStore.length;
    return Promise.resolve(deleted);
  }),
  then: jest.fn().mockImplementation((callback) => {
    return Promise.resolve(callback(modelConfigsStore));
  }),
  singleItem: null,
  currentId: null
};

// Mock database
jest.mock('@//config/database', () => {
  return jest.fn().mockImplementation(() => mockDB);
});

// Mock UUID to be deterministic for tests
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid-123')
}));

// Import the app after mocking
import app from '@//app';
const request = supertest(app);

describe('Model Config API', () => {
  beforeEach(() => {
    // Clear mock data and reset mock functions
    modelConfigsStore = [];
    mockDB.singleItem = null;
    mockDB.currentId = null;
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
  
  describe('POST /model-configs', () => {
    it('should create a new model config', async () => {
      const modelData = {
        model_name: 'new-model',
        api_port: 11434
      };
      
      const response = await request.post('/model-configs').send(modelData);
      
      expect(response.status).toBe(201);
      expect(response.body.model_name).toBe('new-model');
      expect(response.body.api_port).toBe(11434);
      expect(response.body.id).toBeDefined();
      expect(response.body.status).toBe('stopped');
      expect(modelConfigsStore).toHaveLength(1);
    });
    
    it('should return 400 for missing required fields', async () => {
      const response = await request.post('/model-configs').send({
        model_name: 'incomplete-model'
        // Missing api_port
      });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
      expect(modelConfigsStore).toHaveLength(0);
    });
    
    it('should return 409 for duplicate model name', async () => {
      // Add existing model
      const existingModel = {
        id: 'existing-id',
        model_name: 'existing-model',
        api_port: 11434,
        status: 'stopped',
        last_used: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      modelConfigsStore.push(existingModel);
      
      // Mock the database to find the existing model
      mockDB.where.mockImplementation((condition) => {
        if (condition.model_name === 'existing-model') {
          mockDB.singleItem = existingModel;
        } else {
          mockDB.singleItem = undefined;
        }
        return mockDB;
      });
      
      const response = await request.post('/model-configs').send({
        model_name: 'existing-model',
        api_port: 11435
      });
      
      expect(response.status).toBe(409);
      expect(response.body.error).toContain('already exists');
      expect(modelConfigsStore).toHaveLength(1);
    });
  });
  
  describe('PUT /model-configs/:id', () => {
    it('should update an existing model config', async () => {
      // Add existing model
      const existingModel = {
        id: 'update-test-id',
        model_name: 'model-to-update',
        api_port: 11434,
        status: 'stopped',
        last_used: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      modelConfigsStore.push(existingModel);
      
      // Setup mock for finding by id
      mockDB.where.mockImplementation((condition) => {
        if (condition.id === 'update-test-id') {
          mockDB.singleItem = modelConfigsStore.find(m => m.id === 'update-test-id');
          mockDB.currentId = 'update-test-id';
        } else {
          mockDB.singleItem = undefined;
          mockDB.currentId = null;
        }
        return mockDB;
      });
      
      const updateData = {
        model_name: 'updated-model-name',
        api_port: 11435
      };
      
      const response = await request.put('/model-configs/update-test-id').send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.model_name).toBe('updated-model-name');
      expect(response.body.api_port).toBe(11435);
    });
    
    it('should return 404 for non-existent model', async () => {
      // Setup mock to return undefined for non-existent id
      mockDB.where.mockImplementation((condition) => {
        mockDB.singleItem = undefined;
        mockDB.currentId = condition.id;
        return mockDB;
      });
      
      const response = await request.put('/model-configs/non-existent-id').send({
        model_name: 'wont-be-updated',
        api_port: 12000
      });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });
  });
  
  describe('PATCH /model-configs/:id/status', () => {
    it('should update model status to running', async () => {
      // Add existing model
      const existingModel = {
        id: 'status-test-id',
        model_name: 'model-status-test',
        api_port: 11434,
        status: 'stopped',
        last_used: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      modelConfigsStore.push(existingModel);
      
      // Setup mock for finding by id
      mockDB.where.mockImplementation((condition) => {
        if (condition.id === 'status-test-id') {
          mockDB.singleItem = modelConfigsStore.find(m => m.id === 'status-test-id');
          mockDB.currentId = 'status-test-id';
        } else {
          mockDB.singleItem = undefined;
          mockDB.currentId = null;
        }
        return mockDB;
      });
      
      const response = await request.patch('/model-configs/status-test-id/status').send({
        status: 'running'
      });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('running');
      expect(response.body.last_used).toBeDefined();
    });
    
    it('should return 400 for invalid status value', async () => {
      const response = await request.patch('/model-configs/any-id/status').send({
        status: 'invalid-status'
      });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('must be either');
    });
  });
  
  describe('DELETE /model-configs/:id', () => {
    it('should delete an existing model config', async () => {
      // Add existing model
      const existingModel = {
        id: 'delete-test-id',
        model_name: 'model-to-delete',
        api_port: 11434,
        status: 'stopped',
        last_used: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      modelConfigsStore.push(existingModel);
      
      // Setup mock for finding and deleting by id
      mockDB.where.mockImplementation((condition) => {
        mockDB.currentId = condition.id;
        return mockDB;
      });
      
      const response = await request.delete('/model-configs/delete-test-id');
      
      expect(response.status).toBe(204);
      expect(modelConfigsStore).toHaveLength(0);
    });
    
    it('should return 404 for non-existent model', async () => {
      // Setup mock for deleting non-existent id
      mockDB.del.mockResolvedValueOnce(0);
      
      const response = await request.delete('/model-configs/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });
  });
});
