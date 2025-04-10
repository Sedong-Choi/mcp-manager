import express from 'express';
import MessageRepository from '../repositories/MessageRepository';
import ConversationRepository from '../repositories/ConversationRepository';

const router: express.Router = express.Router();

// 특정 대화의 모든 메시지 조회
router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // 해당 대화가 존재하는지 먼저 확인
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
});

// 대화에 새 메시지 추가
router.post('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { role, content } = req.body;
    
    if (!role || !content) {
      return res.status(400).json({ error: 'Role and content are required' });
    }
    
    if (role !== 'user' && role !== 'assistant') {
      return res.status(400).json({ error: 'Role must be either "user" or "assistant"' });
    }
    
    // 해당 대화가 존재하는지 먼저 확인
    const conversation = await ConversationRepository.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const message = await MessageRepository.create({
      conversation_id: conversationId,
      role,
      content
    });
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// 메시지 내용 업데이트
router.put('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const updatedMessage = await MessageRepository.update(id, content);
    
    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// 메시지 삭제
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await MessageRepository.delete(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
