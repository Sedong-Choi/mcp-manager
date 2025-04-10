import { MessageRepository } from '../../../src/repositories/messageRepository';
import { Message } from '../../../src/models/interfaces';

// Mock the database
jest.mock('../../../src/config/database', () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      first: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      del: jest.fn()
    })
  };
});

// Import the mocked database
import db from '../../../src/config/database';

// Mock UUID generation
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-123')
}));

describe('MessageRepository', () => {
  let repository: MessageRepository;
  
  beforeEach(() => {
    repository = new MessageRepository();
    jest.clearAllMocks();
  });
  
  describe('findByConversationId', () => {
    it('should return messages for a conversation ordered by created_at', async () => {
      const mockMessages: Partial<Message>[] = [
        { 
          id: '1', 
          conversation_id: 'conv-1', 
          role: 'user', 
          content: 'Hello' ,
          created_at: '2023-01-01T00:00:00Z'
        },
        { 
          id: '2', 
          conversation_id: 'conv-1', 
          role: 'assistant', 
          content: 'Hi there', 
          created_at: '2023-01-02T00:00:00Z'
        }
      ];
      
      db().select.mockResolvedValueOnce(mockMessages);
      
      const result = await repository.findByConversationId('conv-1');
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ conversation_id: 'conv-1' });
      expect(db().select).toHaveBeenCalledWith('*');
      expect(db().orderBy).toHaveBeenCalledWith('created_at', 'asc');
      expect(result).toEqual(mockMessages);
    });
  });
  
  describe('findById', () => {
    it('should return message by id', async () => {
      const mockMessage: Partial<Message> = { 
        id: '1', 
        conversation_id: 'conv-1', 
        role: 'user', 
        content: 'Hello' 
      };
      
      db().first.mockResolvedValueOnce(mockMessage);
      
      const result = await repository.findById('1');
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(mockMessage);
    });
  });
  
  describe('create', () => {
    it('should create a new message', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const messageInput = {
        conversation_id: 'conv-1',
        role: 'user' as const,
        content: 'Hello, AI!'
      };
      
      const expectedMessage = {
        id: 'mock-uuid-123',
        ...messageInput,
        created_at: mockDate.toISOString()
      };
      
      db().insert.mockResolvedValueOnce([expectedMessage.id]);
      
      const result = await repository.create(messageInput);
      
      expect(db).toHaveBeenCalled();
      expect(db().insert).toHaveBeenCalledWith(expectedMessage);
      expect(result).toEqual(expectedMessage);
    });
  });
  
  describe('update', () => {
    it('should update an existing message', async () => {
      const id = 'existing-id';
      const updateData = {
        content: 'Updated message content'
      };
      
      const updatedMessage = {
        id,
        ...updateData
      };
      
      db().update.mockResolvedValueOnce(1);
      db().first.mockResolvedValueOnce(updatedMessage);
      
      const result = await repository.update(id, updateData);
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(updatedMessage);
    });
  });
  
  describe('delete', () => {
    it('should delete a message and return true when successful', async () => {
      const id = 'existing-id';
      
      db().del.mockResolvedValueOnce(1);
      
      const result = await repository.delete(id);
      
      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().del).toHaveBeenCalled();
      expect(result).toBe(true);
    });
    
    it('should return false when trying to delete a non-existent message', async () => {
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
