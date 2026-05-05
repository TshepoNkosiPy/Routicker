/**
 * Database Connection Module
 * Connects to Supabase PostgreSQL using environment variables
 * Used by all API endpoints for secure database access
 */

const { Pool } = require('pg');

// Initialize connection pool with DATABASE_URL from Vercel environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For production Vercel: SSL is required
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection on startup
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Execute a query with proper error handling
 * @param {string} query - SQL query string
 * @param {array} params - Query parameters for prepared statements
 * @returns {Promise} Query result
 */
async function query(text, params = []) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

module.exports = {
  query,
  pool,
};
