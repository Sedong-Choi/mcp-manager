import express from 'express';
import McpServerRepository from '../repositories/mcpServerRepository';

const router: express.Router = express.Router();

// 모든 MCP 서버 목록 조회
router.get('/', async (req, res) => {
  try {
    const servers = await McpServerRepository.findAll();
    res.json(servers);
  } catch (error) {
    console.error('Error fetching MCP servers:', error);
    res.status(500).json({ error: 'Failed to fetch MCP servers' });
  }
});

// 특정 MCP 서버 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const server = await McpServerRepository.findById(req.params.id);
    if (!server) {
      return res.status(404).json({ error: 'MCP server not found' });
    }
    res.json(server);
  } catch (error) {
    console.error('Error fetching MCP server:', error);
    res.status(500).json({ error: 'Failed to fetch MCP server' });
  }
});

// 새 MCP 서버 등록
router.post('/', async (req, res) => {
  try {
    const { name, type, port, data_path, status = 'stopped' } = req.body;
    
    if (!name || !type || !port || !data_path) {
      return res.status(400).json({ error: 'Name, type, port, and data path are required' });
    }
    
    const server = await McpServerRepository.create({
      name,
      type,
      port,
      data_path,
      status
    });
    
    res.status(201).json(server);
  } catch (error) {
    console.error('Error creating MCP server:', error);
    res.status(500).json({ error: 'Failed to create MCP server' });
  }
});

// MCP 서버 설정 업데이트
router.put('/:id', async (req, res) => {
  try {
    const { name, type, port, data_path } = req.body;
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (port !== undefined) updateData.port = port;
    if (data_path !== undefined) updateData.data_path = data_path;
    
    const updated = await McpServerRepository.update(req.params.id, updateData);
    if (!updated) {
      return res.status(404).json({ error: 'MCP server not found' });
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating MCP server:', error);
    res.status(500).json({ error: 'Failed to update MCP server' });
  }
});

// MCP 서버 상태 업데이트 (running/stopped)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (status !== 'running' && status !== 'stopped') {
      return res.status(400).json({ error: 'Status must be either "running" or "stopped"' });
    }
    
    const updated = await McpServerRepository.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'MCP server not found' });
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating MCP server status:', error);
    res.status(500).json({ error: 'Failed to update MCP server status' });
  }
});

// MCP 서버 등록 삭제
router.delete('/:id', async (req, res) => {
  try {
    const success = await McpServerRepository.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'MCP server not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting MCP server:', error);
    res.status(500).json({ error: 'Failed to delete MCP server' });
  }
});

export default router;
