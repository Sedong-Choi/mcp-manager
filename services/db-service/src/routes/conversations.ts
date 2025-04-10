import express from 'express';
import ConversationRepository from '../repositories/conversationRepository';

const router: express.Router = express.Router();

// 모든 대화 목록 조회
router.get('/', async (req, res) => {
  try {
    const conversations = await ConversationRepository.findAll();
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// 특정 대화 상세 조회
router.get('/:id', async (req, res) => {
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
});

// 새 대화 생성
router.post('/', async (req, res) => {
  try {
    const { title, model_name } = req.body;
    
    if (!title || !model_name) {
      return res.status(400).json({ error: 'Title and model_name are required' });
    }
    
    const conversation = await ConversationRepository.create({ title, model_name });
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// 대화 정보 업데이트
router.put('/:id', async (req, res) => {
  try {
    const { title, model_name } = req.body;
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (model_name !== undefined) updateData.model_name = model_name;
    
    const updatedConversation = await ConversationRepository.update(req.params.id, updateData);
    
    if (!updatedConversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json(updatedConversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// 대화 삭제
router.delete('/:id', async (req, res) => {
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
});

export default router;
