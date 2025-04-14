import knex from "knex";

// test/setup.ts
const testDb = knex({
    client: 'sqlite3',
    connection: {
        filename: ':memory:',
    },
    useNullAsDefault: true,
});

beforeAll(async () => {
    await testDb.schema.createTable('users', table => {
        table.increments('id');
        table.string('name');
    });

    await testDb('users').insert({ name: 'Test User' });
});

afterAll(async () => {
    await testDb.destroy();
});
