// This is a suggestion if you need to adjust the database configuration

import knex from 'knex';
import config from '../knexfile';

// Make sure you're exporting a configured knex instance
const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

export default db;
