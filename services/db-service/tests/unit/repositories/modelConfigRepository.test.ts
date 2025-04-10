import { ModelConfigRepository } from '../../../src/repositories/modelConfigRepository';
import db from '../../../src/config/database';

// Mock the database
jest.mock('../../../src/config/database', () => ({
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  insert: jest.fn().mockResolvedValue([1]),
  update: jest.fn().mockResolvedValue(1),
  del: jest.fn().mockResolvedValue(1)
}));

describe('ModelConfigRepository', () => {
  let repository: ModelConfigRepository;
  
  beforeEach(() => {
    repository = new ModelConfigRepository();
    jest.clearAllMocks();
  });
  
  describe('findAll', () => {
    it('should return all model configs', async () => {
      const mockModels = [
        { id: '1', model_name: 'model1' },
        { id: '2', model_name: 'model2' }
      ];
      
      (db().select as jest.Mock).mockResolvedValueOnce(mockModels);
      
      const result = await repository.findAll();
      
      expect(db).toHaveBeenCalled();
      expect(db().select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockModels);
    });
  });
  
  describe('findById', () => {
    it('should return model config by id', async () => {
      const mockModel = { id: '1', model_name: 'model1' };
      
      (db().where().first as jest.Mock).mockResolvedValueOnce(mockModel);
      
      const result = await repository.findById('1');
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id: '1' });
      expect(db().where().first).toHaveBeenCalled();
      expect(result).toEqual(mockModel);
    });
  });
  
  // Add more tests for create, update, and delete methods
});
