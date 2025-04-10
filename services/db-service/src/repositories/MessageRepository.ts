import { v4 as uuidv4 } from 'uuid';
import db from '../config/db';
import { Message } from '../models/interfaces';

export class MessageRepository {
  private tableName = 'messages';

  async findByConversationId(conversationId: string): Promise<Message[]> {
    return db(this.tableName)
      .where({ conversation_id: conversationId })
      .orderBy('created_at', 'asc');
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
    
    // 대화의 updated_at 시간 업데이트
    await db('conversations')
      .where({ id: message.conversation_id })
      .update({ updated_at: now });
      
    return newMessage;
  }

  async update(id: string, content: string): Promise<Message | undefined> {
    await db(this.tableName)
      .where({ id })
      .update({ content });
      
    const message = await this.findById(id);
    
    // 대화의 updated_at 시간 업데이트
    if (message) {
      await db('conversations')
        .where({ id: message.conversation_id })
        .update({ updated_at: new Date().toISOString() });
    }
    
    return message;
  }

  async delete(id: string): Promise<boolean> {
    // 먼저 메시지를 찾아서 conversation_id를 저장
    const message = await this.findById(id);
    if (!message) return false;
    
    const deleted = await db(this.tableName).where({ id }).delete();
    
    // 대화의 updated_at 시간 업데이트
    if (deleted > 0) {
      await db('conversations')
        .where({ id: message.conversation_id })
        .update({ updated_at: new Date().toISOString() });
    }
    
    return deleted > 0;
  }
}

export default new MessageRepository();
