/**
 * Habits List Endpoint
 * GET /api/habits - Get all habits for authenticated user
 * POST /api/habits - Create a new habit
 */

const { query } = require('../../lib/db');
const { verifyToken, extractToken } = require('../../lib/auth');

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Get all habits for authenticated user
 */
async function handleGet(req, res) {
  try {
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const result = await query(
      `SELECT id, user_id, name, description, created_at, last_completed_at, streak_count, completion_count 
       FROM habits 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [decoded.userId]
    );

    res.status(200).json({
      success: true,
      habits: result.rows,
    });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Create a new habit for authenticated user
 */
async function handlePost(req, res) {
  try {
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Habit name is required' });
    }

    // Check habit limit (max 2 habits per user)
    const countResult = await query(
      'SELECT COUNT(*) FROM habits WHERE user_id = $1',
      [decoded.userId]
    );

    if (parseInt(countResult.rows[0].count) >= 2) {
      return res.status(409).json({ error: 'Maximum 2 habits allowed' });
    }

    const result = await query(
      `INSERT INTO habits (user_id, name, description, created_at, streak_count, completion_count) 
       VALUES ($1, $2, $3, NOW(), 0, 0) 
       RETURNING id, name, description, created_at, streak_count, completion_count`,
      [decoded.userId, name, description || null]
    );

    res.status(201).json({
      success: true,
      habit: result.rows[0],
    });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    return handlePost(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
