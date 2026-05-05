# Environment Variables Reference

This file documents all environment variables needed for Rou-Ticker deployment.

## Local Development

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@localhost:5432/roudb
JWT_SECRET=your-local-dev-secret-change-in-production
NODE_ENV=development
```

## Vercel Production Deployment

In your Vercel dashboard (**Settings → Environment Variables**), add:

### Required Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:xyz123@db.abc123.supabase.co:5432/postgres` | Supabase PostgreSQL connection string with password |
| `JWT_SECRET` | `aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF6gH7iJ8kL9mN0=` | 32-byte random secret for JWT signing |
| `NODE_ENV` | `production` | Node environment (for production deployments) |

### Where to Find Each Value

#### DATABASE_URL (from Supabase)
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** → **Database**
4. Under "Connection Strings", select **URI**
5. Copy the string and **replace [YOUR-PASSWORD]** with your database password
6. Final format: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`

#### JWT_SECRET (generate new one)

**Windows PowerShell:**
```powershell
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)
Write-Host $secret
```

**Mac/Linux Terminal:**
```bash
openssl rand -base64 32
```

**Node.js (any platform):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Copy the output** and use it as your JWT_SECRET.

#### NODE_ENV
Set to `production` for Vercel deployments.

---

## Setting Variables in Vercel

### Step-by-Step

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Rou-Ticker** project
3. Click **Settings** → **Environment Variables**
4. For each variable below, click **"Add New"**:

| Add This | Value | For Which Environments? |
|----------|-------|------------------------|
| `DATABASE_URL` | Your Supabase connection string | ✅ Production ✅ Preview ✅ Development |
| `JWT_SECRET` | Your generated secret | ✅ Production ✅ Preview ✅ Development |
| `NODE_ENV` | `production` | ✅ Production |

5. After adding all, Vercel automatically redeploys
6. Check **Deployments** tab to confirm success (should show "Ready")

---

## Verification

### Test Locally
```bash
# Make sure variables are set
cat .env.local

# Run local server
npm start
# Visit http://localhost:8000/auth.html
```

### Test on Vercel
```bash
# View production environment variables
vercel env list

# View deployment logs
vercel logs --prod
```

---

## Security Notes

⚠️ **IMPORTANT:**
- **Never commit `.env.local` to Git** (already in `.gitignore`)
- **Never share JWT_SECRET** publicly
- **Rotate JWT_SECRET periodically** in production
- **Use strong DATABASE_URL passwords** (Supabase generates these)
- **Keep Supabase password secure** and update periodically

---

## Troubleshooting

### Variables not showing up?
- Refresh the page
- Restart your Vercel dev environment: `vercel dev`

### Deployment still failing?
- Check variables are set for **all three environments**
- Verify no typos in variable names (case-sensitive)
- Check DATABASE_URL password is correct

### API returning 500 errors?
- Verify DATABASE_URL is set
- Verify JWT_SECRET is set
- Check Supabase database is running

---

## Auto-Deployment

Once variables are set:
- ✅ Any push to GitHub master branch triggers deployment
- ✅ Vercel uses the environment variables automatically
- ✅ No manual redeploy needed

```bash
git push origin master
# Vercel deploys automatically in 2-3 minutes
```

