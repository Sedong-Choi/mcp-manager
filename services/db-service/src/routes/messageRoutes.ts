import express from 'express';
import MessageController from '../controllers/messageController';

const router:express.Router = express.Router();

// 특정 대화의 모든 메시지 조회
router.get('/conversations/:conversationId/messages', MessageController.getMessagesByConversationId);

// 대화에 새 메시지 추가
router.post('/conversations/:conversationId/messages', MessageController.createMessage);

// 메시지 내용 업데이트
router.put('/messages/:id', MessageController.updateMessage);

// 메시지 삭제
router.delete('/messages/:id', MessageController.deleteMessage);

export default router;
