# API Examples & Test Cases

This file contains ready-to-use examples for testing all API endpoints.

## 🔐 Authentication Endpoints

### 1. Sign Up (Create New User)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Cases:**
- Missing fields: `400 Bad Request`
- Email already exists: `409 Conflict`
- Invalid email: `400 Bad Request`

---

### 2. Sign In (Login)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Cases:**
- Invalid credentials: `401 Unauthorized`
- Email not found: `401 Unauthorized`

---

## 📝 Habit Endpoints

### 3. Get All Habits

**Request:**
```bash
TOKEN="your-jwt-token-here"

curl http://localhost:3000/api/habits \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "habits": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Morning Run",
      "description": "5km run before breakfast",
      "created_at": "2024-05-05T10:00:00Z",
      "last_completed_at": "2024-05-05T06:30:00Z",
      "streak_count": 4,
      "completion_count": 12
    },
    {
      "id": 2,
      "user_id": 1,
      "name": "Read 20 pages",
      "description": "Daily reading habit",
      "created_at": "2024-05-04T14:00:00Z",
      "last_completed_at": "2024-05-05T20:00:00Z",
      "streak_count": 2,
      "completion_count": 7
    }
  ]
}
```

**Error Cases:**
- Missing token: `401 Unauthorized`
- Invalid token: `401 Unauthorized`

---

### 4. Create New Habit

**Request:**
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Meditation",
    "description": "10 minutes daily meditation"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "habit": {
    "id": 3,
    "name": "Meditation",
    "description": "10 minutes daily meditation",
    "created_at": "2024-05-05T12:00:00Z",
    "streak_count": 0,
    "completion_count": 0
  }
}
```

**Error Cases:**
- Max 2 habits reached: `409 Conflict`
- Missing name: `400 Bad Request`
- Unauthorized: `401 Unauthorized`

---

### 5. Get Specific Habit

**Request:**
```bash
TOKEN="your-jwt-token-here"
HABIT_ID=1

curl http://localhost:3000/api/habits/$HABIT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "habit": {
    "id": 1,
    "user_id": 1,
    "name": "Morning Run",
    "description": "5km run before breakfast",
    "created_at": "2024-05-05T10:00:00Z",
    "last_completed_at": "2024-05-05T06:30:00Z",
    "streak_count": 4,
    "completion_count": 12
  }
}
```

**Error Cases:**
- Habit not found: `404 Not Found`
- Unauthorized: `401 Unauthorized`

---

### 6. Update Habit

**Request:**
```bash
TOKEN="your-jwt-token-here"
HABIT_ID=1

curl -X PUT http://localhost:3000/api/habits/$HABIT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Morning Run",
    "description": "10km run before breakfast"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "habit": {
    "id": 1,
    "name": "Morning Run",
    "description": "10km run before breakfast",
    "created_at": "2024-05-05T10:00:00Z",
    "last_completed_at": "2024-05-05T06:30:00Z",
    "streak_count": 4,
    "completion_count": 12
  }
}
```

**Error Cases:**
- Habit not found: `404 Not Found`
- Missing name: `400 Bad Request`
- Unauthorized: `401 Unauthorized`

---

### 7. Delete Habit

**Request:**
```bash
TOKEN="your-jwt-token-here"
HABIT_ID=1

curl -X DELETE http://localhost:3000/api/habits/$HABIT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Habit deleted successfully"
}
```

**Error Cases:**
- Habit not found: `404 Not Found`
- Unauthorized: `401 Unauthorized`

---

### 8. Toggle Habit Completion

**Request:**
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/api/habits/toggle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "habit_id": 1
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "habit": {
    "id": 1,
    "name": "Morning Run",
    "completion_count": 13,
    "streak_count": 5,
    "last_completed_at": "2024-05-05T14:00:00Z"
  },
  "completion": {
    "id": 45,
    "completed_at": "2024-05-05T14:00:00Z"
  }
}
```

**Error Cases:**
- Already completed today: `400 Bad Request`
- Habit not found: `404 Not Found`
- Unauthorized: `401 Unauthorized`

---

## 🧪 JavaScript/Fetch Examples

### Using the Built-in API Module

```javascript
// Ensure lib/api.js is loaded
// <script src="lib/api.js"></script>

// 1. Sign Up
async function signUpExample() {
  try {
    const result = await window.rou.auth.signup(
      'Jane Doe',
      'jane@example.com',
      'password123'
    );
    console.log('Signed up:', result);
  } catch (error) {
    console.error('Signup failed:', error.message);
  }
}

// 2. Log In
async function loginExample() {
  try {
    const result = await window.rou.auth.login(
      'jane@example.com',
      'password123'
    );
    console.log('Logged in:', result);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// 3. Get All Habits
async function getHabitsExample() {
  try {
    const habits = await window.rou.habits.fetchHabits();
    console.log('Your habits:', habits);
  } catch (error) {
    console.error('Failed to fetch habits:', error.message);
  }
}

// 4. Create Habit
async function createHabitExample() {
  try {
    const habit = await window.rou.habits.createHabit(
      'Drink Water',
      'Drink 8 glasses of water daily'
    );
    console.log('Created habit:', habit);
  } catch (error) {
    console.error('Failed to create habit:', error.message);
  }
}

// 5. Mark Habit Complete
async function toggleHabitExample() {
  try {
    const result = await window.rou.habits.toggleHabitCompletion(1);
    console.log('Marked complete:', result);
  } catch (error) {
    console.error('Failed to toggle habit:', error.message);
  }
}

// 6. Update Habit
async function updateHabitExample() {
  try {
    const habit = await window.rou.habits.updateHabit(
      1,
      'Morning Run',
      'Run 7km before breakfast'
    );
    console.log('Updated habit:', habit);
  } catch (error) {
    console.error('Failed to update habit:', error.message);
  }
}

// 7. Delete Habit
async function deleteHabitExample() {
  try {
    const result = await window.rou.habits.deleteHabit(1);
    console.log('Deleted habit:', result);
  } catch (error) {
    console.error('Failed to delete habit:', error.message);
  }
}

// 8. Check Authentication Status
function checkAuthStatus() {
  if (window.rou.auth.isAuthenticated()) {
    console.log('Logged in as:', window.rou.auth.user);
  } else {
    console.log('Not authenticated');
  }
}

// 9. Log Out
function logoutExample() {
  window.rou.auth.logout();
  console.log('Logged out');
  window.location.href = 'auth.html';
}
```

---

### Using Raw Fetch (Manual)

```javascript
const API_BASE_URL = 'http://localhost:3000';

// Sign Up with raw fetch
async function signUpRaw() {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('rou_token', data.token);
    console.log('Signed up:', data.user);
  } else {
    console.error('Error:', data.error);
  }
}

// Get Habits with raw fetch
async function getHabitsRaw() {
  const token = localStorage.getItem('rou_token');
  const response = await fetch(`${API_BASE_URL}/api/habits`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Habits:', data.habits);
  } else {
    console.error('Error:', data.error);
  }
}
```

---

## 📊 Test Workflow (Complete Scenario)

```bash
#!/bin/bash

# 1. Sign up
echo "1. Creating account..."
SIGNUP=$(curl -s -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test-'$(date +%s)'@example.com",
    "password": "testpass123"
  }')

TOKEN=$(echo $SIGNUP | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "✅ Token: $TOKEN"

# 2. Create habit
echo "2. Creating habit..."
HABIT=$(curl -s -X POST http://localhost:3000/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Morning Run",
    "description": "5km run"
  }')

HABIT_ID=$(echo $HABIT | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "✅ Habit ID: $HABIT_ID"

# 3. Get habits
echo "3. Getting habits..."
curl -s http://localhost:3000/api/habits \
  -H "Authorization: Bearer $TOKEN" | jq .

# 4. Toggle completion
echo "4. Marking as complete..."
curl -s -X POST http://localhost:3000/api/habits/toggle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"habit_id\": $HABIT_ID}" | jq .

echo "✅ Test complete!"
```

---

## 🎯 Testing Checklist

- [ ] Sign up with new email
- [ ] Login with credentials
- [ ] Create first habit
- [ ] Create second habit
- [ ] Verify max 2 habits limit
- [ ] Mark habit as complete
- [ ] Verify streak increases
- [ ] Get all habits
- [ ] Update habit
- [ ] Delete habit
- [ ] Check token persistence
- [ ] Test expired token handling
- [ ] Verify CORS headers

---

## 🔍 Debugging Tips

### Enable Request Logging

Add to your API calls:
```javascript
// Before fetch
console.log('Request:', method, url, body);

// After response
console.log('Response:', status, data);
```

### Monitor Network in Browser

1. Open DevTools (F12)
2. Go to Network tab
3. Perform API calls
4. Inspect request/response headers and body

### Check Database Directly

```sql
-- In Supabase SQL Editor
SELECT * FROM habit_completions ORDER BY completed_at DESC LIMIT 10;
SELECT u.email, COUNT(h.id) habits, SUM(h.completion_count) total_completions
FROM users u LEFT JOIN habits h ON u.id = h.user_id
GROUP BY u.email;
```

---

**Ready to test? Copy these examples and try them out! 🚀**
