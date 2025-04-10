import path from 'path';
import knex from 'knex';
import dotenv from 'dotenv';

// 환경변수 설정 로드
dotenv.config();

// 현재 환경 감지 (기본값은 development)
const environment = process.env.NODE_ENV || 'development';

// Knex 설정 직접 정의
const dbPath = process.env.DB_PATH || '/Users/sedong/Dev/mcp/mcp-manager-pro/data/db/mcp-manager.sqlite3';
const migrationsPath = path.join(__dirname, '../migrations');

const config = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: dbPath
    },
    migrations: {
      directory: migrationsPath
    },
    useNullAsDefault: true
  },
  test: {
    client: 'better-sqlite3',
    connection: {
      filename: ':memory:'
    },
    migrations: {
      directory: migrationsPath
    },
    useNullAsDefault: true
  },
  production: {
    client: 'better-sqlite3',
    connection: {
      filename: dbPath
    },
    migrations: {
      directory: migrationsPath
    },
    useNullAsDefault: true
  }
};

// Knex 인스턴스 생성
const db = knex(config[environment as keyof typeof config]);

export default db;
