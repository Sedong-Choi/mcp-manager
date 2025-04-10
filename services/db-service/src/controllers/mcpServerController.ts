import { Request, Response } from 'express';
import McpServerRepository from '../repositories/mcpServerRepository';

class McpServerController {
  async getAllMcpServers(req: Request, res: Response) {
    try {
      const mcpServers = await McpServerRepository.findAll();
      res.json(mcpServers);
    } catch (error) {
      console.error('Error fetching MCP servers:', error);
      res.status(500).json({ error: 'Failed to fetch MCP servers' });
    }
  }

  async getMcpServerById(req: Request, res: Response) {
    try {
      const mcpServer = await McpServerRepository.findById(req.params.id);
      if (!mcpServer) {
        return res.status(404).json({ error: 'MCP server not found' });
      }
      res.json(mcpServer);
    } catch (error) {
      console.error('Error fetching MCP server:', error);
      res.status(500).json({ error: 'Failed to fetch MCP server' });
    }
  }

  async createMcpServer(req: Request, res: Response) {
    try {
      const { name, type, port, data_path, status = 'stopped' } = req.body;
      
      if (!name || !type || !port || !data_path) {
        return res.status(400).json({ error: 'Name, type, port, and data path are required' });
      }
      
      // 이미 존재하는 서버 이름인지 확인
      const existing = await McpServerRepository.findByName(name);
      if (existing) {
        return res.status(409).json({ error: 'Server name already exists' });
      }
      
      const mcpServer = await McpServerRepository.create({
        name,
        type,
        port,
        data_path,
        status
      });
      
      res.status(201).json(mcpServer);
    } catch (error) {
      console.error('Error creating MCP server:', error);
      res.status(500).json({ error: 'Failed to create MCP server' });
    }
  }

  async updateMcpServer(req: Request, res: Response) {
    try {
      const { name, type, port, data_path, status } = req.body;
      const updateData: any = {};
      
      if (name !== undefined) updateData.name = name;
      if (type !== undefined) updateData.type = type;
      if (port !== undefined) updateData.port = port;
      if (data_path !== undefined) updateData.data_path = data_path;
      if (status !== undefined) updateData.status = status;
      
      // 이름 변경 시 중복 확인
      if (name) {
        const existing = await McpServerRepository.findByName(name);
        if (existing && existing.id !== req.params.id) {
          return res.status(409).json({ error: 'Server name already exists' });
        }
      }
      
      const updated = await McpServerRepository.update(req.params.id, updateData);
      if (!updated) {
        return res.status(404).json({ error: 'MCP server not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating MCP server:', error);
      res.status(500).json({ error: 'Failed to update MCP server' });
    }
  }

  async updateMcpServerStatus(req: Request, res: Response) {
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
  }

  async deleteMcpServer(req: Request, res: Response) {
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
  }
}

export default new McpServerController();
