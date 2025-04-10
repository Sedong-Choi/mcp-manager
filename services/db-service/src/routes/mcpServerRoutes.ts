import express from 'express';
import McpServerController from '@/controllers/mcpServerController';

const router:express.Router = express.Router();

// 모든 MCP 서버 목록 조회
router.get('/', McpServerController.getAllMcpServers);

// 특정 MCP 서버 상세 조회
router.get('/:id', McpServerController.getMcpServerById);

// 새 MCP 서버 등록
router.post('/', McpServerController.createMcpServer);

// MCP 서버 설정 업데이트
router.put('/:id', McpServerController.updateMcpServer);

// MCP 서버 상태 업데이트
router.patch('/:id/status', McpServerController.updateMcpServerStatus);

// MCP 서버 등록 삭제
router.delete('/:id', McpServerController.deleteMcpServer);

export default router;
