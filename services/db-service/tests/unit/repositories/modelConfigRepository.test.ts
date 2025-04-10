import { ModelConfigRepository } from '../../../src/repositories/modelConfigRepository';
import { ModelConfig } from '../../../src/models/interfaces';

// Mock the database first, before using it
jest.mock('../../../src/config/database', () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      del: jest.fn()
    })
  };
});

// Import the mocked database
import db from '../../../src/config/database';

// Mock UUID generation to be deterministic
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-123')
}));

describe('ModelConfigRepository', () => {
  let repository: ModelConfigRepository;
  
  beforeEach(() => {
    repository = new ModelConfigRepository();
    jest.clearAllMocks();
  });
  
  describe('findAll', () => {
    it('should return all model configs', async () => {
      const mockModels: Partial<ModelConfig>[] = [
        { id: '1', model_name: 'model1' },
        { id: '2', model_name: 'model2' }
      ];
      
      db().select.mockResolvedValueOnce(mockModels);
      
      const result = await repository.findAll();
      
      expect(db).toHaveBeenCalled();
      expect(db().select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockModels);
    });
  });
  
  describe('findById', () => {
    it('should return model config by id', async () => {
      const mockModel: Partial<ModelConfig> = { id: '1', model_name: 'model1' };
      
      db().first.mockResolvedValueOnce(mockModel);
      
      const result = await repository.findById('1');
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(mockModel);
    });
  });
  
  describe('findByModelName', () => {
    it('should return model config by model name', async () => {
      const mockModel: Partial<ModelConfig> = { id: '1', model_name: 'test-model' };
      
      db().first.mockResolvedValueOnce(mockModel);
      
      const result = await repository.findByModelName('test-model');
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ model_name: 'test-model' });
      expect(result).toEqual(mockModel);
    });

    it('should return undefined when model not found', async () => {
      db().first.mockResolvedValueOnce(undefined);
      
      const result = await repository.findByModelName('non-existent-model');
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ model_name: 'non-existent-model' });
      expect(result).toBeUndefined();
    });
  });
  
  describe('create', () => {
    it('should create a new model config', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const modelInput = {
        model_name: 'new-model',
        api_port: 11434,
        status: 'stopped' as const,
        last_used: null
      };
      
      const expectedModel = {
        id: 'mock-uuid-123',
        ...modelInput,
        created_at: mockDate.toISOString(),
        updated_at: mockDate.toISOString()
      };
      
      db().insert.mockResolvedValueOnce([expectedModel.id]);
      
      const result = await repository.create(modelInput);
      
      expect(db).toHaveBeenCalled();
      expect(db().insert).toHaveBeenCalledWith(expectedModel);
      expect(result).toEqual(expectedModel);
    });
  });
  
  describe('update', () => {
    it('should update an existing model config', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const id = 'existing-id';
      const updateData = {
        model_name: 'updated-model',
        api_port: 11435
      };
      
      const updatedModel = {
        id,
        ...updateData,
        status: 'stopped',
        updated_at: mockDate.toISOString()
      };
      
      db().update.mockResolvedValueOnce(1);
      db().first.mockResolvedValueOnce(updatedModel);
      
      const result = await repository.update(id, updateData);
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().update).toHaveBeenCalledWith({
        ...updateData,
        updated_at: mockDate.toISOString()
      });
      expect(result).toEqual(updatedModel);
    });
  });
  
  describe('updateStatus', () => {
    it('should update status to running and set last_used', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const id = 'existing-id';
      const status = 'running' as const;
      
      const updatedModel = {
        id,
        status,
        last_used: mockDate.toISOString(),
        updated_at: mockDate.toISOString()
      };
      
      db().update.mockResolvedValueOnce(1);
      db().first.mockResolvedValueOnce(updatedModel);
      
      const result = await repository.updateStatus(id, status);
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().update).toHaveBeenCalledWith({
        status,
        updated_at: mockDate.toISOString(),
        last_used: mockDate.toISOString()
      });
      expect(result).toEqual(updatedModel);
    });
    
    it('should update status to stopped without setting last_used', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const id = 'existing-id';
      const status = 'stopped' as const;
      
      const updatedModel = {
        id,
        status,
        updated_at: mockDate.toISOString()
      };
      
      db().update.mockResolvedValueOnce(1);
      db().first.mockResolvedValueOnce(updatedModel);
      
      const result = await repository.updateStatus(id, status);
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().update).toHaveBeenCalledWith({
        status,
        updated_at: mockDate.toISOString()
      });
      expect(result).toEqual(updatedModel);
    });
  });
  
  describe('delete', () => {
    it('should delete a model config and return true when successful', async () => {
      const id = 'existing-id';
      
      db().del.mockResolvedValueOnce(1);
      
      const result = await repository.delete(id);
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().del).toHaveBeenCalled();
      expect(result).toBe(true);
    });
    
    it('should return false when trying to delete a non-existent model', async () => {
      const id = 'non-existent-id';
      
      db().del.mockResolvedValueOnce(0);
      
      const result = await repository.delete(id);
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().del).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
