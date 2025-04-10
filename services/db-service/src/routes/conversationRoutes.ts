import express from 'express';
import ConversationController from '../controllers/conversationController';

const router:express.Router = express.Router();

// 모든 대화 목록 조회
router.get('/', ConversationController.getAllConversations);

// 특정 대화 상세 조회
router.get('/:id', ConversationController.getConversationById);

// 새 대화 생성
router.post('/', ConversationController.createConversation);

// 대화 정보 업데이트
router.put('/:id', ConversationController.updateConversation);

// 대화 삭제
router.delete('/:id', ConversationController.deleteConversation);

export default router;
