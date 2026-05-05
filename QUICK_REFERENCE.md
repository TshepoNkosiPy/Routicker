# Rou-Ticker Developer Quick Reference

## 🚀 Local Development Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your credentials
cp .env.example .env.local
# Edit .env.local with DATABASE_URL and JWT_SECRET

# 3. Terminal 1: Start API server
npm run dev
# or: vercel dev

# 4. Terminal 2: Serve frontend
python -m http.server 8000
# or: npx http-server

# 5. Open browser
http://localhost:8000/auth.html
```

## 📋 Environment Variables Checklist

Required for development:
```
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/postgres
JWT_SECRET=your-secret-key
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3000
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🔌 API Endpoints Reference

### Auth (No token required)
```
POST /api/auth/signup
POST /api/auth/login
```

### Habits (Token required)
```
GET    /api/habits              # Get all
POST   /api/habits              # Create
GET    /api/habits/[id]         # Get specific
PUT    /api/habits/[id]         # Update
DELETE /api/habits/[id]         # Delete
POST   /api/habits/toggle       # Mark complete
```

## 🧪 Quick API Tests

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Save token from response, then:

# Get habits (replace TOKEN)
curl http://localhost:3000/api/habits \
  -H "Authorization: Bearer TOKEN"

# Create habit
curl -X POST http://localhost:3000/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Morning Run","description":"5km run"}'

# Toggle completion
curl -X POST http://localhost:3000/api/habits/toggle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"habit_id":1}'
```

## 🗄️ Database Quick Reference

### Connection Test
```bash
node -e "const {query}=require('./lib/db');query('SELECT NOW()').then(r=>{console.log('✅',r.rows[0]);process.exit(0)}).catch(e=>{console.error('❌',e.message);process.exit(1)})"
```

### View Tables
In Supabase SQL Editor:
```sql
-- View users
SELECT * FROM users;

-- View habits
SELECT * FROM habits;

-- View completions
SELECT * FROM habit_completions;

-- View user stats
SELECT u.email, COUNT(h.id) as habit_count, SUM(h.completion_count) as total_completions
FROM users u
LEFT JOIN habits h ON u.id = h.user_id
GROUP BY u.id, u.email;
```

### Reset Database (Development)
```sql
-- Delete all data (careful!)
TRUNCATE habit_completions CASCADE;
TRUNCATE habits CASCADE;
TRUNCATE users CASCADE;
```

## 🔒 Security Improvements (Before Production)

```bash
# 1. Add bcrypt for password hashing
npm install bcrypt

# 2. Add input validation
npm install joi

# 3. Add rate limiting
npm install express-rate-limit

# 4. Update signup to hash passwords
# In api/auth/signup.js:
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
// Store hashedPassword
```

## 📊 File Locations

| File | Purpose |
|------|---------|
| `lib/db.js` | Database connection |
| `lib/auth.js` | JWT helpers |
| `lib/api.js` | Frontend API client |
| `api/auth/*.js` | Auth endpoints |
| `api/habits/*.js` | Habit endpoints |
| `auth.html` | Login/signup page |
| `routicker_premium.html` | Main app (after login) |
| `.env.example` | Environment template |
| `DATABASE_SETUP.md` | Database instructions |
| `DEPLOYMENT.md` | Vercel deployment guide |
| `SETUP.md` | Complete setup instructions |

## 🐛 Debugging Tips

### Check if logged in
```javascript
console.log(window.rou.auth.isAuthenticated());
console.log(localStorage.getItem('rou_token'));
```

### Test API calls
```javascript
// In browser console
window.rou.habits.fetchHabits()
  .then(habits => console.log(habits))
  .catch(err => console.error(err));
```

### View logs
```bash
vercel logs              # Development
vercel logs --prod       # Production
```

### Clear browser data
```javascript
localStorage.clear(); // Remove auth token
localStorage.removeItem('rou_token'); // Remove specific token
```

## 🚢 Deployment Checklist

- [ ] Add environment variables to Vercel
- [ ] Run `npm install` locally
- [ ] Test all endpoints locally
- [ ] Commit code to GitHub
- [ ] Connect GitHub repo to Vercel
- [ ] Set DATABASE_URL in Vercel
- [ ] Set JWT_SECRET in Vercel
- [ ] Update REACT_APP_API_URL to production domain
- [ ] Test signup/login on production
- [ ] Monitor Vercel logs for errors
- [ ] Test database backups work
- [ ] Set up error monitoring

## 📞 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Connection refused | Check DATABASE_URL, Supabase status |
| 401 Unauthorized | Add Authorization header |
| 409 Email exists | Use different email for signup |
| CORS error | Check API_BASE_URL, add https |
| Password wrong | Check .env.local file |
| No data loading | Check token expiration |

## 💡 Pro Tips

1. **Use VS Code REST Client** - Create `.rest` file for API testing
2. **Monitor database queries** - Check Supabase logs for slow queries
3. **Use Postman** - For more complex API testing
4. **Set up monitoring** - Use Vercel Analytics
5. **Keep secrets safe** - Never log credentials
6. **Test production locally** - Use `vercel build && vercel start`

## 📚 Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Node.js pg Module](https://node-postgres.com/)
- [JWT.io](https://jwt.io/)

## 🎯 Next Steps After Setup

1. Test all endpoints with sample data
2. Implement password hashing with bcrypt
3. Add input validation with Joi
4. Set up rate limiting
5. Add database connection pooling
6. Implement caching layer
7. Set up monitoring/alerting
8. Plan backup strategy
9. Document API with Swagger
10. Set up CI/CD pipeline

---

**Need help? Check SETUP.md, DATABASE_SETUP.md, or DEPLOYMENT.md**
