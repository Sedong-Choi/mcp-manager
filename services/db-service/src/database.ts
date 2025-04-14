import Knex from 'knex';
import config from '../knexfile';

type Environment = keyof typeof config; // 'development' | 'test' | 'production'

const env = process.env.NODE_ENV;
let environment: Environment;

if (env === 'development' || env === 'test' || env === 'production') {
  environment = env;
} else {
  console.warn(`Invalid NODE_ENV: ${env}. Defaulting to 'development'.`);
  environment = 'development';
  // 또는 오류를 발생시킬 수도 있습니다:
  // throw new Error(`Invalid NODE_ENV: ${env}`); 
}

const knexConfig = config[environment]; // 이제 안전하게 접근 가능

const db = Knex(knexConfig);

export default db;
