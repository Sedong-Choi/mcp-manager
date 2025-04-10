import { Request, Response } from 'express';
import ConversationRepository from '../repositories/conversationRepository';

class ConversationController {
  async getAllConversations(req: Request, res: Response) {
    try {
      const conversations = await ConversationRepository.findAll();
      res.json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }

  async getConversationById(req: Request, res: Response) {
    try {
      const conversation = await ConversationRepository.findById(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      res.json(conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ error: 'Failed to fetch conversation' });
    }
  }

  async createConversation(req: Request, res: Response) {
    try {
      const { title, model_name } = req.body;
      
      if (!title || !model_name) {
        return res.status(400).json({ error: 'Title and model name are required' });
      }
      
      const conversation = await ConversationRepository.create({
        title,
        model_name
      });
      
      res.status(201).json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  }

  async updateConversation(req: Request, res: Response) {
    try {
      const { title, model_name } = req.body;
      const updateData: any = {};
      
      if (title !== undefined) updateData.title = title;
      if (model_name !== undefined) updateData.model_name = model_name;
      
      const updated = await ConversationRepository.update(req.params.id, updateData);
      if (!updated) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating conversation:', error);
      res.status(500).json({ error: 'Failed to update conversation' });
    }
  }

  async deleteConversation(req: Request, res: Response) {
    try {
      const success = await ConversationRepository.delete(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      res.status(500).json({ error: 'Failed to delete conversation' });
    }
  }
}

export default new ConversationController();
