import { Request, Response } from 'express';
import { ModelService } from '../services/modelService';

export class ModelController {
  private modelService: ModelService;

  constructor(modelService: ModelService) {
    this.modelService = modelService;
  }

  async downloadModel(req: Request, res: Response): Promise<void> {
    const { modelName } = req.params;
    try {
      const downloadStatus = await this.modelService.downloadModel(modelName);
      res.status(200).json({ success: true, status: downloadStatus });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async loadModel(req: Request, res: Response): Promise<void> {
    const { modelName } = req.params;
    try {
      const loadStatus = await this.modelService.loadModel(modelName);
      res.status(200).json({ success: true, status: loadStatus });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async unloadModel(req: Request, res: Response): Promise<void> {
    const { modelName } = req.params;
    try {
      const unloadStatus = await this.modelService.unloadModel(modelName);
      res.status(200).json({ success: true, status: unloadStatus });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

// For backward compatibility with existing code
export const downloadModel = (req: Request, res: Response) => {
  const { modelName } = req.params;
  try {
    const modelService = require('../services/modelService').default;
    modelService.downloadModel(modelName)
      .then(downloadStatus => {
        res.status(200).json({ success: true, status: downloadStatus });
      })
      .catch(error => {
        res.status(500).json({ success: false, message: error.message });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loadModel = (req: Request, res: Response) => {
  const { modelName } = req.params;
  try {
    const modelService = require('../services/modelService').default;
    modelService.loadModel(modelName)
      .then(loadStatus => {
        res.status(200).json({ success: true, status: loadStatus });
      })
      .catch(error => {
        res.status(500).json({ success: false, message: error.message });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unloadModel = (req: Request, res: Response) => {
  const { modelName } = req.params;
  try {
    const modelService = require('../services/modelService').default;
    modelService.unloadModel(modelName)
      .then(unloadStatus => {
        res.status(200).json({ success: true, status: unloadStatus });
      })
      .catch(error => {
        res.status(500).json({ success: false, message: error.message });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};