/* istanbul ignore file */
const { Pool } = require('pg');
const config = require('../../../../config/env');

const testConfig = {
  host: config.postgresTest.host,
  port: config.postgresTest.port,
  user: config.postgresTest.user,
  password: config.postgresTest.password,
  database: config.postgresTest.db,
};

const pool =
  process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool();

module.exports = pool;
