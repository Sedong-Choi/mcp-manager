import knex from 'knex';
import path from 'path';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// 데이터베이스 경로 설정
const dbPath = process.env.DB_PATH || path.join(process.cwd(), '../../data/db/mcp-manager.sqlite');

// Knex 인스턴스 생성
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath
  },
  useNullAsDefault: true,
  // 외래키 제약 조건 활성화
  pool: {
    afterCreate: (conn: any, done: Function) => {
      conn.run('PRAGMA foreign_keys = ON', done);
    }
  }
});

export default db;
