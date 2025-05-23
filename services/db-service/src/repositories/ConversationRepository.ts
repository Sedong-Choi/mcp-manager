import { v4 as uuidv4 } from 'uuid';
import db from '@/database';
import { Conversation } from '@/models/interfaces';

export class ConversationRepository {
  private tableName = 'conversations';

  async findAll(): Promise<Conversation[]> {
    // Use proper Knex.js chainable method for sorting
    return db(this.tableName)
      .select('*')
      .orderBy('updated_at', 'desc');
  }

  async findById(id: string): Promise<Conversation | undefined> {
    return db(this.tableName).where({ id }).first();
  }

  async create(conversation: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>): Promise<Conversation> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newConversation: Conversation = {
      id,
      ...conversation,
      created_at: now,
      updated_at: now
    };
    
    await db(this.tableName).insert(newConversation);
    return newConversation;
  }

  async update(id: string, data: Partial<Omit<Conversation, 'id' | 'created_at'>>): Promise<Conversation | undefined> {
    const updateData: any = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    await db(this.tableName).where({ id }).update(updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await db(this.tableName).where({ id }).del();
    return deleted > 0;
  }
}

export default new ConversationRepository();
