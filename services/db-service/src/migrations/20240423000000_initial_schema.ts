import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // conversations 테이블 생성
  await knex.schema.createTable('conversations', (table) => {
    table.string('id').primary();
    table.string('title').notNullable();
    table.string('model_name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // messages 테이블 생성
  await knex.schema.createTable('messages', (table) => {
    table.string('id').primary();
    table.string('conversation_id').notNullable();
    table.string('role').notNullable();
    table.text('content').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // 외래키 연결
    table.foreign('conversation_id')
      .references('id')
      .inTable('conversations')
      .onDelete('CASCADE');
  });

  // model_configs 테이블 생성
  await knex.schema.createTable('model_configs', (table) => {
    table.string('id').primary();
    table.string('model_name').notNullable().unique();
    table.integer('api_port').notNullable();
    table.string('status').notNullable().defaultTo('stopped');
    table.timestamp('last_used').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // mcp_servers 테이블 생성
  await knex.schema.createTable('mcp_servers', (table) => {
    table.string('id').primary();
    table.string('name').notNullable().unique();
    table.string('type').notNullable();
    table.integer('port').notNullable();
    table.string('data_path').notNullable();
    table.string('status').notNullable().defaultTo('stopped');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  // 마이그레이션 롤백: 테이블 삭제 (외래키 때문에 순서 중요)
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('conversations');
  await knex.schema.dropTableIfExists('model_configs');
  await knex.schema.dropTableIfExists('mcp_servers');
}
