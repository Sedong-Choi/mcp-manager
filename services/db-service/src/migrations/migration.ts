import fs from 'fs';
import path from 'path';
import db from '@/config/database';

interface MigrationRecord {
  id: number;
  name: string;
  executed_at: string;
}

export class MigrationManager {
  private readonly tableName = 'migrations';
  private readonly scriptsDir = path.join(__dirname, 'scripts');

  async initialize(): Promise<void> {
    // 마이그레이션 테이블이 없으면 생성
    const exists = await db.schema.hasTable(this.tableName);
    if (!exists) {
      await db.schema.createTable(this.tableName, (table) => {
        table.increments('id').primary();
        table.string('name').notNullable().unique();
        table.timestamp('executed_at').defaultTo(db.fn.now());
      });
    }
  }

  async getExecutedMigrations(): Promise<string[]> {
    const records = await db(this.tableName).select('name');
    return records.map((record: MigrationRecord) => record.name);
  }

  async runMigrations(): Promise<number> {
    await this.initialize();
    
    // 이미 실행된 마이그레이션 가져오기
    const executedMigrations = await this.getExecutedMigrations();
    
    // 마이그레이션 스크립트 파일 가져오기
    const files = await fs.promises.readdir(this.scriptsDir);
    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort(); // 파일명으로 정렬
    
    let migrationsRun = 0;
    
    // 아직 실행되지 않은 마이그레이션만 실행
    for (const file of sqlFiles) {
      if (!executedMigrations.includes(file)) {
        try {
          // SQL 파일 내용 읽기
          const filePath = path.join(this.scriptsDir, file);
          const sql = await fs.promises.readFile(filePath, 'utf8');
          
          // 트랜잭션 내에서 마이그레이션 실행
          await db.transaction(async (trx) => {
            console.log(`Running migration: ${file}`);
            
            // SQL 스크립트 실행
            await trx.raw(sql);
            
            // 마이그레이션 기록
            await trx(this.tableName).insert({
              name: file,
              executed_at: new Date().toISOString()
            });
          });
          
          migrationsRun++;
          console.log(`Migration ${file} completed successfully`);
        } catch (error) {
          console.error(`Error running migration ${file}:`, error);
          throw error;
        }
      }
    }
    
    return migrationsRun;
  }
}

export default new MigrationManager();
