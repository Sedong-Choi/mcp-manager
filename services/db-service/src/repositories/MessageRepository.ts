import { v4 as uuidv4 } from 'uuid';
import db from '@/database';
import { Message } from '@/models/interfaces';

export class MessageRepository {
  private tableName = 'messages';

  async findByConversationId(conversationId: string): Promise<Message[]> {
    const results = await db(this.tableName)
      .where({ conversation_id: conversationId })
      .select('*');
    
    // Sort in JavaScript instead of SQL
    return results.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  async findById(id: string): Promise<Message | undefined> {
    return db(this.tableName).where({ id }).first();
  }

  async create(message: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newMessage: Message = {
      id,
      ...message,
      created_at: now
    };
    
    await db(this.tableName).insert(newMessage);
    return newMessage;
  }

  async update(id: string, data: Partial<Omit<Message, 'id' | 'created_at' | 'conversation_id' | 'role'>>): Promise<Message | undefined> {
    await db(this.tableName).where({ id }).update(data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await db(this.tableName).where({ id }).del();
    return deleted > 0;
  }
}

export default new MessageRepository();
