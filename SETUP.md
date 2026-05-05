# Rou-Ticker Premium - Complete Setup Guide

## 📁 Project Structure

```
rou-ticker/
├── api/                           # Vercel serverless functions
│   ├── auth/
│   │   ├── signup.js             # User registration endpoint
│   │   └── login.js              # User login endpoint
│   └── habits/
│       ├── index.js              # GET all habits, POST create habit
│       ├── [id].js               # GET, PUT, DELETE individual habit
│       └── toggle.js             # POST toggle completion
├── lib/
│   ├── db.js                     # Database connection module
│   ├── auth.js                   # JWT authentication helpers
│   └── api.js                    # Frontend API client
├── index.html                     # Main landing page
├── routicker_premium.html         # App page (after login)
├── routicker_premium.css          # Styles
├── routicker_premium.js           # Original frontend logic
├── package.json                   # Dependencies
├── .env.example                   # Environment variables template
├── vercel.json                    # Vercel configuration
├── DATABASE_SETUP.md              # Database setup instructions
├── DEPLOYMENT.md                  # Vercel deployment guide
└── SETUP.md                       # This file
```

## 🚀 Quick Start (Local Development)

### 1. Prerequisites

- Node.js 18+ installed
- PostgreSQL/Supabase account
- Git (optional)

### 2. Clone or Set Up Project

```bash
# Navigate to project directory
cd rou-ticker
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Database

**Follow DATABASE_SETUP.md** for complete instructions:

1. Create Supabase project
2. Get DATABASE_URL
3. Run SQL schema
4. Verify connection

### 5. Configure Environment Variables

Create `.env.local` file in project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
JWT_SECRET=your-secret-key-here
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3000
```

### 6. Run Local Server

**Terminal 1 - Start API server:**
```bash
npm run dev
# or use Vercel CLI: vercel dev
```

**Terminal 2 - Serve frontend files:**
```bash
python -m http.server 8000
# or: npx http-server
```

Then open: **http://localhost:8000**

## 🔐 Authentication Flow

### Sign Up

1. User enters name, email, password
2. Frontend calls: `POST /api/auth/signup`
3. Backend creates user in database
4. JWT token returned and stored in localStorage
5. User redirected to app

### Log In

1. User enters email, password
2. Frontend calls: `POST /api/auth/login`
3. Backend verifies credentials
4. JWT token returned and stored
5. User can access app

### Making Authenticated Requests

All API calls to `/api/habits/*` require Authorization header:

```javascript
// Example using fetch
const response = await fetch('/api/habits', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('rou_token')}`
  }
});
```

The `api.js` module handles this automatically:

```javascript
// Using the built-in API manager
const habits = await window.rou.habits.fetchHabits();
```

## 📊 API Endpoints Reference

### Authentication

```
POST /api/auth/signup
  Body: { name, email, password }
  Returns: { token, userId, user }

POST /api/auth/login
  Body: { email, password }
  Returns: { token, userId, user }
```

### Habits (All require Authorization header)

```
GET /api/habits
  Returns: { habits: [...] }

POST /api/habits
  Body: { name, description? }
  Returns: { habit }

GET /api/habits/[id]
  Returns: { habit }

PUT /api/habits/[id]
  Body: { name, description? }
  Returns: { habit }

DELETE /api/habits/[id]
  Returns: { success: true }

POST /api/habits/toggle
  Body: { habit_id }
  Returns: { habit, completion }
```

## 📱 Frontend Integration

### Import API Module

```html
<script src="lib/api.js"></script>
```

### Use Authentication

```javascript
// Sign up
await window.rou.auth.signup('John', 'john@example.com', 'password123');

// Log in
await window.rou.auth.login('john@example.com', 'password123');

// Check if logged in
if (window.rou.auth.isAuthenticated()) {
  console.log('User:', window.rou.auth.user);
}

// Log out
window.rou.auth.logout();
```

### Use Habit Manager

```javascript
// Get all habits
const habits = await window.rou.habits.fetchHabits();

// Create habit
const habit = await window.rou.habits.createHabit('Morning Run', 'Run 5km');

// Update habit
await window.rou.habits.updateHabit(1, 'Morning Run', 'Run 10km');

// Mark as completed today
await window.rou.habits.toggleHabitCompletion(1);

// Delete habit
await window.rou.habits.deleteHabit(1);
```

## 🔒 Security Notes

### Current State (Development)

- ✅ JWT tokens issued for authentication
- ⚠️ Passwords stored as plain text (NOT safe)
- ⚠️ No rate limiting
- ⚠️ Basic CORS setup

### Before Production

Implement these critical features:

**1. Password Hashing**

```bash
npm install bcrypt
```

Update `api/auth/signup.js`:
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
// Store hashedPassword instead of plaintext
```

Update `api/auth/login.js`:
```javascript
const bcrypt = require('bcrypt');
const validPassword = await bcrypt.compare(password, user.password_hash);
```

**2. Rate Limiting**

```bash
npm install express-rate-limit
```

**3. Input Validation**

```bash
npm install joi
```

**4. HTTPS Only**

- Vercel provides HTTPS automatically
- Use secure cookies with httpOnly flag
- Set SameSite policy on cookies

**5. Environment Variables**

- Never commit `.env.local` (add to `.gitignore`)
- Use Vercel's secure environment variables
- Rotate secrets regularly

## 🐛 Debugging

### Check Database Connection

```bash
node -e "
const { query } = require('./lib/db');
query('SELECT NOW()').then(res => {
  console.log('✅ Connected!', res.rows[0]);
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
"
```

### Test API Endpoint

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Get habits (replace TOKEN with actual token)
curl http://localhost:3000/api/habits \
  -H "Authorization: Bearer TOKEN"
```

### View Vercel Logs

```bash
vercel logs  # Development/preview
vercel logs --prod  # Production
```

### Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing/invalid token | Check `Authorization` header |
| 409 Conflict | User already exists | Use different email |
| Connection refused | Database offline | Check DATABASE_URL, Supabase status |
| CORS error | Frontend/API URL mismatch | Update REACT_APP_API_URL |

## 📈 Performance Tips

1. **Database Indexing** - Already configured in schema
2. **Connection Pooling** - Using pg Pool in db.js
3. **Caching** - Consider Redis for frequently accessed data
4. **CDN** - Vercel provides edge caching
5. **Monitoring** - Use Vercel Analytics

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Guide](https://jwt.io/introduction)
- [Node.js pg Documentation](https://node-postgres.com/)

## 🎯 Next Steps

1. ✅ Set up Supabase project
2. ✅ Configure environment variables
3. ✅ Install dependencies
4. ✅ Run local development
5. ✅ Test all API endpoints
6. 🔄 Add password hashing (security)
7. 🔄 Implement rate limiting
8. 🔄 Deploy to Vercel
9. 🔄 Monitor production
10. 🔄 Plan scaling strategy

## 💬 Support

For issues:
- Check DATABASE_SETUP.md for database problems
- Check DEPLOYMENT.md for Vercel issues
- Review API endpoint documentation
- Check browser console and Vercel logs

---

**Happy habit tracking! 🎯**
