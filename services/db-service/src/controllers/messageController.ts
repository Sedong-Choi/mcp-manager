import { Request, Response } from 'express';
import MessageRepository from '@/repositories/MessageRepository';
import ConversationRepository from '@/repositories/ConversationRepository';

class MessageController {
  async getMessagesByConversationId(req: Request, res: Response) {
    try {
      const conversationId = req.params.conversationId;
      
      // 먼저 대화가 존재하는지 확인
      const conversation = await ConversationRepository.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      const messages = await MessageRepository.findByConversationId(conversationId);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  async createMessage(req: Request, res: Response) {
    try {
      const conversationId = req.params.conversationId;
      const { role, content } = req.body;
      
      if (!role || !content) {
        return res.status(400).json({ error: 'Role and content are required' });
      }
      
      if (role !== 'user' && role !== 'assistant') {
        return res.status(400).json({ error: 'Role must be either "user" or "assistant"' });
      }
      
      // 대화가 존재하는지 확인
      const conversation = await ConversationRepository.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      const message = await MessageRepository.create({
        conversation_id: conversationId,
        role,
        content
      });
      
      // 대화 최종 수정 시간 업데이트
      await ConversationRepository.update(conversationId, { updated_at: new Date().toISOString() });
      
      res.status(201).json(message);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Failed to create message' });
    }
  }

  async updateMessage(req: Request, res: Response) {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }
      
      const updated = await MessageRepository.update(req.params.id, { content });
      if (!updated) {
        return res.status(404).json({ error: 'Message not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating message:', error);
      res.status(500).json({ error: 'Failed to update message' });
    }
  }

  async deleteMessage(req: Request, res: Response) {
    try {
      const success = await MessageRepository.delete(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: 'Message not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  }
}

export default new MessageController();
