import { McpServerRepository } from '@//repositories/mcpServerRepository';
import { McpServer } from '@//models/interfaces';

// Mock the database
jest.mock('@//config/database', () => {
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
import db from '@//config/database';

// Mock UUID generation
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-123')
}));

describe('McpServerRepository', () => {
  let repository: McpServerRepository;
  
  beforeEach(() => {
    repository = new McpServerRepository();
    jest.clearAllMocks();
  });
  
  describe('findAll', () => {
    it('should return all MCP servers', async () => {
      const mockServers: Partial<McpServer>[] = [
        { 
          id: '1', 
          name: 'Server 1', 
          type: 'ollama', 
          port: 11434, 
          data_path: '/path/to/data1',
          status: 'running'
        },
        { 
          id: '2', 
          name: 'Server 2', 
          type: 'ollama', 
          port: 11435, 
          data_path: '/path/to/data2',
          status: 'stopped'
        }
      ];
      
      db().select.mockResolvedValueOnce(mockServers);
      
      const result = await repository.findAll();
      
      expect(db).toHaveBeenCalled();
      expect(db().select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockServers);
    });
  });
  
  describe('findById', () => {
    it('should return server by id', async () => {
      const mockServer: Partial<McpServer> = { 
        id: '1', 
        name: 'Test Server', 
        type: 'ollama'
      };
      
      db().first.mockResolvedValueOnce(mockServer);
      
      const result = await repository.findById('1');
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(mockServer);
    });
  });
  
  describe('findByName', () => {
    it('should return server by name', async () => {
      const mockServer: Partial<McpServer> = { 
        id: '1', 
        name: 'Test Server', 
        type: 'ollama'
      };
      
      db().first.mockResolvedValueOnce(mockServer);
      
      const result = await repository.findByName('Test Server');
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ name: 'Test Server' });
      expect(result).toEqual(mockServer);
    });
  });
  
  describe('create', () => {
    it('should create a new MCP server', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const serverInput = {
        name: 'New Server',
        type: 'ollama',
        port: 11434,
        data_path: '/data/path',
        status: 'stopped' as const
      };
      
      const expectedServer = {
        id: 'mock-uuid-123',
        ...serverInput,
        created_at: mockDate.toISOString(),
        updated_at: mockDate.toISOString()
      };
      
      db().insert.mockResolvedValueOnce([expectedServer.id]);
      
      const result = await repository.create(serverInput);
      
      expect(db).toHaveBeenCalled();
      expect(db().insert).toHaveBeenCalledWith(expectedServer);
      expect(result).toEqual(expectedServer);
    });
  });
  
  describe('update', () => {
    it('should update an existing server', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const id = 'existing-id';
      const updateData = {
        name: 'Updated Server Name',
        port: 11435
      };
      
      const updatedServer = {
        id,
        ...updateData,
        updated_at: mockDate.toISOString()
      };
      
      db().update.mockResolvedValueOnce(1);
      db().first.mockResolvedValueOnce(updatedServer);
      
      const result = await repository.update(id, updateData);
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().update).toHaveBeenCalledWith({
        ...updateData,
        updated_at: mockDate.toISOString()
      });
      expect(result).toEqual(updatedServer);
    });
  });
  
  describe('updateStatus', () => {
    it('should update server status', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const id = 'existing-id';
      const status = 'running' as const;
      
      const updatedServer = {
        id,
        status,
        updated_at: mockDate.toISOString()
      };
      
      db().update.mockResolvedValueOnce(1);
      db().first.mockResolvedValueOnce(updatedServer);
      
      const result = await repository.updateStatus(id, status);
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().update).toHaveBeenCalledWith({
        status,
        updated_at: mockDate.toISOString()
      });
      expect(result).toEqual(updatedServer);
    });
  });
  
  describe('delete', () => {
    it('should delete a server and return true when successful', async () => {
      const id = 'existing-id';
      
      db().del.mockResolvedValueOnce(1);
      
      const result = await repository.delete(id);
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().del).toHaveBeenCalled();
      expect(result).toBe(true);
    });
    
    it('should return false when trying to delete a non-existent server', async () => {
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
