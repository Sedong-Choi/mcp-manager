import { Request, Response } from 'express';
import ModelConfigRepository from '@/repositories/ModelConfigRepository';

class ModelConfigController {
  async getAllModelConfigs(req: Request, res: Response) {
    try {
      const modelConfigs = await ModelConfigRepository.findAll();
      res.json(modelConfigs);
    } catch (error) {
      console.error('Error fetching model configs:', error);
      res.status(500).json({ error: 'Failed to fetch model configs' });
    }
  }

  async getModelConfigById(req: Request, res: Response) {
    try {
      const modelConfig = await ModelConfigRepository.findById(req.params.id);
      if (!modelConfig) {
        return res.status(404).json({ error: 'Model config not found' });
      }
      res.json(modelConfig);
    } catch (error) {
      console.error('Error fetching model config:', error);
      res.status(500).json({ error: 'Failed to fetch model config' });
    }
  }

  async createModelConfig(req: Request, res: Response) {
    try {
      const { model_name, api_port, status = 'stopped' } = req.body;
      
      if (!model_name || !api_port) {
        return res.status(400).json({ error: 'Model name and API port are required' });
      }
      
      // 이미 존재하는 모델 이름인지 확인
      const existing = await ModelConfigRepository.findByModelName(model_name);
      if (existing) {
        return res.status(409).json({ error: 'Model name already exists' });
      }
      
      const modelConfig = await ModelConfigRepository.create({
        model_name,
        api_port,
        status,
        last_used: null
      });
      
      res.status(201).json(modelConfig);
    } catch (error) {
      console.error('Error creating model config:', error);
      res.status(500).json({ error: 'Failed to create model config' });
    }
  }

  async updateModelConfig(req: Request, res: Response) {
    try {
      const { model_name, api_port, status } = req.body;
      const updateData: any = {};
      
      if (model_name !== undefined) updateData.model_name = model_name;
      if (api_port !== undefined) updateData.api_port = api_port;
      if (status !== undefined) updateData.status = status;
      
      // 이름 변경 시 중복 확인
      if (model_name) {
        const existing = await ModelConfigRepository.findByModelName(model_name);
        if (existing && existing.id !== req.params.id) {
          return res.status(409).json({ error: 'Model name already exists' });
        }
      }
      
      const updated = await ModelConfigRepository.update(req.params.id, updateData);
      if (!updated) {
        return res.status(404).json({ error: 'Model config not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating model config:', error);
      res.status(500).json({ error: 'Failed to update model config' });
    }
  }

  async updateModelStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      
      if (status !== 'running' && status !== 'stopped') {
        return res.status(400).json({ error: 'Status must be either "running" or "stopped"' });
      }
      
      const updated = await ModelConfigRepository.updateStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ error: 'Model config not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating model status:', error);
      res.status(500).json({ error: 'Failed to update model status' });
    }
  }

  async deleteModelConfig(req: Request, res: Response) {
    try {
      const success = await ModelConfigRepository.delete(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: 'Model config not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting model config:', error);
      res.status(500).json({ error: 'Failed to delete model config' });
    }
  }
}

export default new ModelConfigController();
