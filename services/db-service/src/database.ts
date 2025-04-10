// This is a suggestion if you need to adjust the database configuration

import knex from 'knex';
import config from '../knexfile';

// 환경 변수에 따른 설정 사용
const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

// 외래 키 제약 조건 활성화 (SQLite 특성 상 별도 설정 필요)
db.raw('PRAGMA foreign_keys = ON;').catch(error => {
  console.error('외래 키 제약 조건 활성화 오류:', error);
});

export default db;
