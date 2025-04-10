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
  
  // Add more tests for create, update, and delete methods
});
