import express from 'express';
import ModelConfigController from '../controllers/modelConfigController';

const router:express.Router = express.Router();

// 모든 모델 설정 조회
router.get('/', ModelConfigController.getAllModelConfigs);

// 특정 모델 설정 조회
router.get('/:id', ModelConfigController.getModelConfigById);

// 새 모델 설정 추가
router.post('/', ModelConfigController.createModelConfig);

// 모델 설정 업데이트
router.put('/:id', ModelConfigController.updateModelConfig);

// 모델 상태 업데이트
router.patch('/:id/status', ModelConfigController.updateModelStatus);

// 모델 설정 삭제
router.delete('/:id', ModelConfigController.deleteModelConfig);

export default router;
