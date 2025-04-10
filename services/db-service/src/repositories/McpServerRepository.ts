import { v4 as uuidv4 } from 'uuid';
import db from '@/config/database';
import { McpServer } from '@/models/interfaces';

export class McpServerRepository {
  private tableName = 'mcp_servers';

  async findAll(): Promise<McpServer[]> {
    return db(this.tableName).select('*');
  }

  async findById(id: string): Promise<McpServer | undefined> {
    return db(this.tableName).where({ id }).first();
  }
  
  async findByName(name: string): Promise<McpServer | undefined> {
    return db(this.tableName).where({ name }).first();
  }

  async create(mcpServer: Omit<McpServer, 'id' | 'created_at' | 'updated_at'>): Promise<McpServer> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newMcpServer: McpServer = {
      id,
      ...mcpServer,
      created_at: now,
      updated_at: now
    };
    
    await db(this.tableName).insert(newMcpServer);
    return newMcpServer;
  }

  async update(id: string, data: Partial<Omit<McpServer, 'id' | 'created_at'>>): Promise<McpServer | undefined> {
    const updateData: any = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    await db(this.tableName).where({ id }).update(updateData);
    return this.findById(id);
  }

  async updateStatus(id: string, status: 'running' | 'stopped'): Promise<McpServer | undefined> {
    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };
    
    await db(this.tableName).where({ id }).update(updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await db(this.tableName).where({ id }).del();
    return deleted > 0;
  }
}

export default new McpServerRepository();
