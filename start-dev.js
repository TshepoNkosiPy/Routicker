#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Simple mock database
const users = {
  'test@example.com': {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123!',
  }
};

const userHabits = {
  '1': [
    { id: 1, name: 'Morning run', completed: false, log: [1, 1, 0, 1, 0, 1, 0] },
    { id: 2, name: 'Read 20 pages', completed: false, log: [0, 1, 0, 0, 1, 0, 0] },
  ]
};

// Simple token generator
function generateToken(userId) {
  return Buffer.from(`${userId}:${Date.now()}:${Math.random()}`).toString('base64');
}

// API server
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.writeHead(200).end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle POST body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const bodyData = body ? JSON.parse(body) : {};

      // Authentication endpoints
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const { email, password } = bodyData;
        
        if (!email || !password) {
          return res.writeHead(400, { 'Content-Type': 'application/json' }).end(
            JSON.stringify({ error: 'Email and password are required' })
          );
        }

        const user = users[email];
        if (!user || user.password !== password) {
          return res.writeHead(401, { 'Content-Type': 'application/json' }).end(
            JSON.stringify({ error: 'Invalid email or password' })
          );
        }

        const token = generateToken(user.id);
        return res.writeHead(200, { 'Content-Type': 'application/json' }).end(
          JSON.stringify({
            token,
            userId: user.id,
            user: { id: user.id, name: user.name, email: user.email },
          })
        );
      }

      if (pathname === '/api/auth/signup' && req.method === 'POST') {
        const { name, email, password } = bodyData;
        
        if (!name || !email || !password) {
          return res.writeHead(400, { 'Content-Type': 'application/json' }).end(
            JSON.stringify({ error: 'Name, email, and password are required' })
          );
        }

        if (users[email]) {
          return res.writeHead(409, { 'Content-Type': 'application/json' }).end(
            JSON.stringify({ error: 'Email already exists' })
          );
        }

        const userId = Object.keys(users).length + 1;
        const newUser = { id: userId, name, email, password };
        users[email] = newUser;

        const token = generateToken(userId);
        return res.writeHead(201, { 'Content-Type': 'application/json' }).end(
          JSON.stringify({
            token,
            userId,
            user: { id: userId, name, email },
          })
        );
      }

      // Habits endpoints
      if (pathname === '/api/habits' && req.method === 'GET') {
        const auth = req.headers.authorization;
        if (!auth) {
          return res.writeHead(401, { 'Content-Type': 'application/json' }).end(
            JSON.stringify({ error: 'Unauthorized' })
          );
        }

        // Extract userId from token (simple implementation)
        const token = auth.replace('Bearer ', '');
        const userId = '1'; // For demo, always use user 1
        
        const habits = userHabits[userId] || [];
        return res.writeHead(200, { 'Content-Type': 'application/json' }).end(
          JSON.stringify({ habits })
        );
      }

      if (pathname === '/api/habits' && req.method === 'POST') {
        const auth = req.headers.authorization;
        if (!auth) {
          return res.writeHead(401, { 'Content-Type': 'application/json' }).end(
            JSON.stringify({ error: 'Unauthorized' })
          );
        }

        const { name, description } = bodyData;
        const userId = '1';
        if (!userHabits[userId]) userHabits[userId] = [];
        
        const habitId = Date.now();
        const habit = { id: habitId, name, description, completed: false, log: [0,0,0,0,0,0,0] };
        userHabits[userId].push(habit);

        return res.writeHead(201, { 'Content-Type': 'application/json' }).end(
          JSON.stringify({ habit })
        );
      }

      if (pathname.match(/^\/api\/habits\/\d+$/) && req.method === 'DELETE') {
        const auth = req.headers.authorization;
        if (!auth) {
          return res.writeHead(401, { 'Content-Type': 'application/json' }).end(
            JSON.stringify({ error: 'Unauthorized' })
          );
        }

        const habitId = parseInt(pathname.split('/')[3]);
        const userId = '1';
        
        if (userHabits[userId]) {
          userHabits[userId] = userHabits[userId].filter(h => h.id !== habitId);
        }

        return res.writeHead(200, { 'Content-Type': 'application/json' }).end(
          JSON.stringify({ success: true })
        );
      }

      if (pathname === '/api/habits/toggle' && req.method === 'POST') {
        const auth = req.headers.authorization;
        if (!auth) {
          return res.writeHead(401, { 'Content-Type': 'application/json' }).end(
            JSON.stringify({ error: 'Unauthorized' })
          );
        }

        const { habit_id, completed, log } = bodyData;
        const userId = '1';

        if (userHabits[userId]) {
          const habit = userHabits[userId].find(h => h.id === habit_id);
          if (habit) {
            habit.completed = completed;
            if (log) habit.log = log;
          }
        }

        return res.writeHead(200, { 'Content-Type': 'application/json' }).end(
          JSON.stringify({ success: true })
        );
      }

      // Default response
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    } catch (error) {
      console.error('Server error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ API server running at http://localhost:${PORT}`);
  console.log(`📁 Open http://localhost:8000/auth.html in your browser`);
  console.log(`\n🔑 Test Credentials:`);
  console.log(`   Email: test@example.com`);
  console.log(`   Password: TestPass123!`);
});
