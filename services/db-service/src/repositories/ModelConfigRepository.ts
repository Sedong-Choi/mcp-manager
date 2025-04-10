import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { ModelConfig } from '../models/interfaces';

export class ModelConfigRepository {
  private tableName = 'model_configs';

  async findAll(): Promise<ModelConfig[]> {
    return db(this.tableName).select('*');
  }

  async findById(id: string): Promise<ModelConfig | undefined> {
    return db(this.tableName).where({ id }).first();
  }

  async findByModelName(modelName: string): Promise<ModelConfig | undefined> {
    return db(this.tableName).where({ model_name: modelName }).first();
  }

  async create(modelConfig: Omit<ModelConfig, 'id' | 'created_at' | 'updated_at'>): Promise<ModelConfig> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newModelConfig: ModelConfig = {
      id,
      ...modelConfig,
      created_at: now,
      updated_at: now
    };
    
    await db(this.tableName).insert(newModelConfig);
    return newModelConfig;
  }

  async update(id: string, data: Partial<Omit<ModelConfig, 'id' | 'created_at' | 'updated_at'>>): Promise<ModelConfig | undefined> {
    const updated_at = new Date().toISOString();
    
    await db(this.tableName)
      .where({ id })
      .update({
        ...data,
        updated_at
      });
      
    return this.findById(id);
  }

  async updateStatus(id: string, status: 'running' | 'stopped'): Promise<ModelConfig | undefined> {
    const updated_at = new Date().toISOString();
    const last_used = status === 'running' ? updated_at : undefined;
    
    await db(this.tableName)
      .where({ id })
      .update({
        status,
        updated_at,
        ...(last_used && { last_used })
      });
      
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await db(this.tableName).where({ id }).delete();
    return deleted > 0;
  }
}

export default new ModelConfigRepository();
