import { Request, Response } from 'express';
import modelService from '../services/modelService';

export const downloadModel = async (req: Request, res: Response) => {
  const { modelName } = req.params;
  try {
    const downloadStatus = await modelService.downloadModel(modelName);
    res.status(200).json({ success: true, status: downloadStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};