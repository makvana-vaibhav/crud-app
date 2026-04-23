const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "testdb",
  password: process.env.PGPASSWORD || "postgres",
  port: Number(process.env.PGPORT || 5432),
});

const initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `);
};

module.exports = { pool, initializeDatabase };