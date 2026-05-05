/**
 * Individual Habit Endpoint
 * GET /api/habits/[id] - Get specific habit
 * PUT /api/habits/[id] - Update habit
 * DELETE /api/habits/[id] - Delete habit
 */

const { query } = require('../../lib/db');
const { verifyToken, extractToken } = require('../../lib/auth');

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Get a specific habit
 */
async function handleGet(habitId, userId, res) {
  try {
    const result = await query(
      `SELECT id, user_id, name, description, created_at, last_completed_at, streak_count, completion_count 
       FROM habits 
       WHERE id = $1 AND user_id = $2`,
      [habitId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.status(200).json({
      success: true,
      habit: result.rows[0],
    });
  } catch (error) {
    console.error('Get habit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update a habit (name, description)
 */
async function handlePut(habitId, userId, req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Habit name is required' });
    }

    const result = await query(
      `UPDATE habits 
       SET name = $1, description = $2 
       WHERE id = $3 AND user_id = $4 
       RETURNING id, name, description, created_at, last_completed_at, streak_count, completion_count`,
      [name, description || null, habitId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.status(200).json({
      success: true,
      habit: result.rows[0],
    });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Delete a habit
 */
async function handleDelete(habitId, userId, res) {
  try {
    // First delete completion logs for this habit
    await query('DELETE FROM habit_completions WHERE habit_id = $1', [habitId]);

    // Then delete the habit itself
    const result = await query(
      'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING id',
      [habitId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Habit deleted successfully',
    });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract and verify token for all methods
  const token = extractToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Get habit ID from URL path
  const habitId = req.query.id;
  if (!habitId) {
    return res.status(400).json({ error: 'Habit ID is required' });
  }

  if (req.method === 'GET') {
    return handleGet(habitId, decoded.userId, res);
  } else if (req.method === 'PUT') {
    return handlePut(habitId, decoded.userId, req, res);
  } else if (req.method === 'DELETE') {
    return handleDelete(habitId, decoded.userId, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
