import { ConversationRepository } from '@/repositories/ConversationRepository';
import { Conversation } from '@/models/interfaces';

// Mock the database first, before using it
jest.mock('@/database', () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockImplementation(function() {
        // Explicitly return this to ensure proper chaining
        return this;
      }),
      first: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      del: jest.fn()
    })
  };
});

// Import the mocked database
import db from '@/database';

// Mock UUID generation
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-123')
}));

describe('ConversationRepository', () => {
  let repository: ConversationRepository;

  beforeEach(() => {
    repository = new ConversationRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all conversations ordered by updated_at desc', async () => {
      const mockConversations: Partial<Conversation>[] = [
        { id: '1', title: 'Conversation 1', model_name: 'model1', updated_at: '2023-01-01T00:00:00Z' },
        { id: '2', title: 'Conversation 2', model_name: 'model2', updated_at: '2023-01-02T00:00:00Z' }
      ];

      // Update the mock to resolve after the chain
      const mockDb = db();
      mockDb.select.mockImplementation(() => mockDb);
      mockDb.orderBy.mockResolvedValueOnce(mockConversations);

      const result = await repository.findAll();

      expect(db).toHaveBeenCalled();
      expect(db().select).toHaveBeenCalledWith('*');
      expect(db().orderBy).toHaveBeenCalledWith('updated_at', 'desc');
      expect(result).toEqual(mockConversations);
    });
  });

  describe('findById', () => {
    it('should return conversation by id', async () => {
      const mockConversation: Partial<Conversation> = {
        id: '1',
        title: 'Test Conversation',
        model_name: 'model1'
      };

      db().first.mockResolvedValueOnce(mockConversation);

      const result = await repository.findById('1');

      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(mockConversation);
    });
  });

  describe('create', () => {
    it('should create a new conversation', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const conversationInput = {
        title: 'New Conversation',
        model_name: 'test-model'
      };

      const expectedConversation = {
        id: 'mock-uuid-123',
        ...conversationInput,
        created_at: mockDate.toISOString(),
        updated_at: mockDate.toISOString()
      };

      db().insert.mockResolvedValueOnce([expectedConversation.id]);

      const result = await repository.create(conversationInput);

      expect(db).toHaveBeenCalled();
      expect(db().insert).toHaveBeenCalledWith(expectedConversation);
      expect(result).toEqual(expectedConversation);
    });
  });

  describe('update', () => {
    it('should update an existing conversation', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const id = 'existing-id';
      const updateData = {
        title: 'Updated Conversation'
      };

      const updatedConversation = {
        id,
        ...updateData,
        updated_at: mockDate.toISOString()
      };

      db().update.mockResolvedValueOnce(1);
      db().first.mockResolvedValueOnce(updatedConversation);

      const result = await repository.update(id, updateData);

      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().update).toHaveBeenCalledWith({
        ...updateData,
        updated_at: mockDate.toISOString()
      });
      expect(result).toEqual(updatedConversation);
    });
  });

  describe('delete', () => {
    it('should delete a conversation and return true when successful', async () => {
      const id = 'existing-id';

      db().del.mockResolvedValueOnce(1);

      const result = await repository.delete(id);

      expect(db).toHaveBeenCalled();
      expect(db().where).toHaveBeenCalledWith({ id });
      expect(db().del).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when trying to delete a non-existent conversation', async () => {
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
