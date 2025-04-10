import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());

// 데이터베이스 초기화
const dbDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'mcp-manager.db');
const db = new Database(dbPath);

// 기본 테이블 스키마 정의
db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
  );
`);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tables', (req, res) => {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
  res.json({ tables });
});

app.listen(port, () => {
  console.log(`Database service running on port ${port}`);
});
