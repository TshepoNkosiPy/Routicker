/**
 * Toggle Habit Completion Endpoint
 * POST /api/habits/toggle - Mark habit as completed for today
 * 
 * Request body:
 * {
 *   "habit_id": 123
 * }
 * 
 * Returns: { success: true, habit, completionLog }
 */

const { query } = require('../../lib/db');
const { verifyToken, extractToken } = require('../../lib/auth');

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { habit_id } = req.body;
    if (!habit_id) {
      return res.status(400).json({ error: 'habit_id is required' });
    }

    // Verify the habit belongs to the user
    const habitCheck = await query(
      'SELECT id, completion_count FROM habits WHERE id = $1 AND user_id = $2',
      [habit_id, decoded.userId]
    );

    if (habitCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Check if already completed today
    const today = new Date().toISOString().split('T')[0];
    const existingCompletion = await query(
      `SELECT id FROM habit_completions 
       WHERE habit_id = $1 AND DATE(completed_at) = $2`,
      [habit_id, today]
    );

    if (existingCompletion.rows.length > 0) {
      return res.status(400).json({ error: 'Habit already completed today' });
    }

    // Record completion
    const completionResult = await query(
      `INSERT INTO habit_completions (habit_id, completed_at) 
       VALUES ($1, NOW()) 
       RETURNING id, completed_at`,
      [habit_id]
    );

    // Update completion count and streak
    const newCompletionCount = habitCheck.rows[0].completion_count + 1;
    const habitUpdateResult = await query(
      `UPDATE habits 
       SET completion_count = $1, last_completed_at = NOW(), streak_count = streak_count + 1 
       WHERE id = $2 
       RETURNING id, name, completion_count, streak_count, last_completed_at`,
      [newCompletionCount, habit_id]
    );

    res.status(200).json({
      success: true,
      habit: habitUpdateResult.rows[0],
      completion: completionResult.rows[0],
    });
  } catch (error) {
    console.error('Toggle habit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
