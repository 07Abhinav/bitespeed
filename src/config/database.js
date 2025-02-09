const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Render provides this
    ssl: {
        rejectUnauthorized: false, // Required for Render PostgreSQL
    },
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Error connecting to PostgreSQL:', err));

module.exports = pool;
