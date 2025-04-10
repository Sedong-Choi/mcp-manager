import supertest from 'supertest';
import app from '../../../src/app';
import db from '../../../src/config/database';
import { v4 as uuidv4 } from 'uuid';

const request = supertest(app);

// Use an in-memory SQLite database for testing
jest.mock('../../../src/config/database', () => {
  const knex = require('knex');
  return knex({
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true
  });
});

describe('Model Config API', () => {
  beforeAll(async () => {
    // Set up test database schema
    await db.schema.createTable('model_configs', (table) => {
      table.string('id').primary();
      table.string('model_name').notNullable().unique();
      table.integer('api_port').notNullable();
      table.string('status').notNullable().defaultTo('stopped');
      table.timestamp('last_used').nullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
  });
  
  afterAll(async () => {
    await db.schema.dropTable('model_configs');
    await db.destroy();
  });
  
  afterEach(async () => {
    await db('model_configs').del();
  });
  
  describe('GET /model-configs', () => {
    it('should return empty array when no models exist', async () => {
      const response = await request.get('/model-configs');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    
    it('should return all model configs', async () => {
      // Insert test data
      const modelConfig = {
        id: uuidv4(),
        model_name: 'test-model',
        api_port: 11434,
        status: 'stopped',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await db('model_configs').insert(modelConfig);
      
      const response = await request.get('/model-configs');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].model_name).toBe('test-model');
    });
  });
  
  // Add more integration tests for POST, PUT, PATCH, DELETE
});
