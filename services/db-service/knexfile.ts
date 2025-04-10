import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const dbPath = process.env.DB_PATH || '../../data/db/mcp-manager.sqlite3';
const migrationsPath = path.join(__dirname, 'src/migrations');

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

export default config;
module.exports = config; // CommonJS 호환성을 위한 export
