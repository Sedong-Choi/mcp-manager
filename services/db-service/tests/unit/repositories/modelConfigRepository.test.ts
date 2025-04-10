import { ModelConfigRepository } from '../../../src/repositories/modelConfigRepository';
import { ModelConfig } from '../../../src/models/interfaces';

// Mock DB 함수 타입
type MockDB = jest.Mocked<{
  (): {
    select: jest.MockInstance<any, any>;
    where: jest.MockInstance<any, any>;
    first: jest.MockInstance<any, any>;
    insert: jest.MockInstance<any, any>;
    update: jest.MockInstance<any, any>;
    del: jest.MockInstance<any, any>;
  }
}>;

// Mock the database
const mockDB = jest.fn().mockReturnValue({
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  del: jest.fn()
}) as MockDB;

jest.mock('../../../src/config/database', () => mockDB);

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
      
      mockDB().select.mockResolvedValueOnce(mockModels);
      
      const result = await repository.findAll();
      
      expect(mockDB).toHaveBeenCalled();
      expect(mockDB().select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockModels);
    });
  });
  
  describe('findById', () => {
    it('should return model config by id', async () => {
      const mockModel: Partial<ModelConfig> = { id: '1', model_name: 'model1' };
      
      mockDB().first.mockResolvedValueOnce(mockModel);
      
      const result = await repository.findById('1');
      
      expect(mockDB).toHaveBeenCalled();
      expect(mockDB().where).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(mockModel);
    });
  });
  
  // Add more tests for create, update, and delete methods
});
