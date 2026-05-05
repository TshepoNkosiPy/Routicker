# Rou-Ticker Database Setup Guide

## Prerequisites
- Supabase account (free tier available at https://supabase.com)
- PostgreSQL knowledge (basic)

## Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Name: `rou-ticker` (or preferred name)
5. Database password: Create a strong password
6. Region: Choose nearest to your users
7. Click "Create new project"

## Step 2: Get Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Under "Connection string", select **URI**
3. Copy the connection string (replace `[YOUR-PASSWORD]` with your database password)
4. This is your `DATABASE_URL`

## Step 3: Run SQL Schema

In Supabase SQL Editor, run the following SQL to create tables:

\`\`\`sql
-- Create users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create habits table
CREATE TABLE habits (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_completed_at TIMESTAMP,
  streak_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  UNIQUE(user_id, name)
);

-- Create habit completions table (for tracking daily completions)
CREATE TABLE habit_completions (
  id BIGSERIAL PRIMARY KEY,
  habit_id BIGINT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_completed_at ON habit_completions(completed_at);

-- Enable Row Level Security (RLS) for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
\`\`\`

## Step 4: Set Up Row Level Security (Optional but Recommended)

\`\`\`sql
-- Policies for users table (only see own data)
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid()::bigint = id);

-- Policies for habits table
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  USING (user_id = auth.uid()::bigint);

CREATE POLICY "Users can create own habits"
  ON habits FOR INSERT
  WITH CHECK (user_id = auth.uid()::bigint);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  USING (user_id = auth.uid()::bigint);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  USING (user_id = auth.uid()::bigint);

-- Policies for habit_completions
CREATE POLICY "Users can view own habit completions"
  ON habit_completions FOR SELECT
  USING (habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid()::bigint));
\`\`\`

## Step 5: Create Local .env.local File

Copy `.env.example` to `.env.local` and fill in:

\`\`\`
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
JWT_SECRET=your-secret-key-here
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3000
\`\`\`

## Step 6: Install Dependencies

\`\`\`bash
npm install
\`\`\`

## Testing the Database Connection

Run a quick test:

\`\`\`bash
node -e "
const { query } = require('./lib/db');
query('SELECT NOW()').then(res => {
  console.log('✅ Database connected!', res.rows[0]);
  process.exit(0);
}).catch(err => {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
});
"
\`\`\`

## Deployment to Vercel

See DEPLOYMENT.md for complete Vercel setup instructions.
