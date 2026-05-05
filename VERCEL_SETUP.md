# 🚀 Vercel Deployment Setup Guide

This guide walks you through deploying Rou-Ticker to Vercel with auto-deployment from GitHub.

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free at https://vercel.com)
- ✅ Supabase PostgreSQL database (with connection string)
- ✅ Code already pushed to GitHub (Done! ✓)

---

## 🔑 Step 1: Generate JWT_SECRET

First, generate a strong JWT secret for production use.

### On Windows (PowerShell):
```powershell
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)
Write-Host $secret
```

### On Mac/Linux (Terminal):
```bash
openssl rand -base64 32
```

**Save this value** - you'll need it for Vercel environment variables.

Example output:
```
aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF6gH7iJ8kL9mN0=
```

---

## 📝 Step 2: Get Your Supabase CONNECTION String

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** → **Database**
4. Under "Connection string" select **URI**
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your actual database password

**Example:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.abc123.supabase.co:5432/postgres
```

---

## 🌐 Step 3: Connect GitHub to Vercel

### Method A: Via Vercel Dashboard (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Search for: `Routicker` or `rou-ticker`
5. Click **"Import"**
6. **Framework Preset:** Select **"Other"** (we're using static HTML + serverless functions)
7. Click **"Deploy"** (we'll add environment variables next)

### Method B: Via GitHub App

1. Go to https://github.com/apps/vercel
2. Click **"Install"**
3. Select your repository: `Routicker`
4. Authorize the connection

---

## 🔐 Step 4: Configure Environment Variables in Vercel

1. After importing the project, go to **Settings** → **Environment Variables**
2. Add each variable below for **all environments** (Production, Preview, Development)

### Add these 3 variables:

#### Variable 1: DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** Your Supabase connection string (from Step 2)
- **Environments:** ✅ Production ✅ Preview ✅ Development

#### Variable 2: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** The JWT secret you generated in Step 1
- **Environments:** ✅ Production ✅ Preview ✅ Development

#### Variable 3: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- **Environments:** ✅ Production

---

## ✅ Step 5: Verify Auto-Deployment

1. After setting environment variables, Vercel automatically redeploys
2. Wait for deployment to complete (2-3 minutes)
3. You'll see **"Ready"** status when done
4. Click the **"Visit"** button to see your deployed app

**Your Vercel URL will look like:**
```
https://rou-ticker-abc123.vercel.app
```

---

## 🧪 Step 6: Test the Deployment

### Test Sign Up
Open your browser and test the authentication:

1. Go to: `https://your-vercel-domain.vercel.app/auth.html`
2. Click **"Sign Up"** tab
3. Fill in the form:
   - **Full Name:** Test User
   - **Email:** test@example.com
   - **Password:** test12345
   - **Confirm:** test12345
4. Click **"Create Account"**

**Expected result:** Login successful → Redirects to app

### Test Sign In
1. Click **"Sign In"** tab
2. Enter the credentials you just created
3. Click **"Sign In"**

**Expected result:** Welcome page with your name

### Test Dark Mode
Click the moon icon in the top-right corner to toggle dark mode.

---

## 🔗 Step 7: Update Frontend API URLs (if needed)

The frontend now **automatically detects** whether it's running:
- ✅ **Localhost** → Uses `http://localhost:3000`
- ✅ **Vercel domain** → Uses the same origin (`window.location.origin`)

**No manual changes needed!** But if you want to manually set it:

Edit `lib/api.js` line 15 and change:
```javascript
return 'https://your-vercel-domain.vercel.app';
```

---

## 🔄 Step 8: Enable Auto-Deployments

Your project is already set up for auto-deployment!

**How it works:**
1. You push code to GitHub master branch
2. GitHub notifies Vercel automatically
3. Vercel builds and deploys within 2-3 minutes
4. Your site updates automatically

**To trigger a new deployment:**
```bash
git add .
git commit -m "your message"
git push origin master
```

---

## 📊 Monitoring & Debugging

### View Deployment Logs
1. Go to your Vercel project dashboard
2. Click **"Deployments"**
3. Click the deployment you want to check
4. Click **"Logs"** tab

### Check for Errors
```bash
vercel logs --prod
```

### Common Errors & Fixes

#### ❌ "DATABASE_URL is not defined"
- **Fix:** Add `DATABASE_URL` to Vercel environment variables

#### ❌ "JWT_SECRET is not defined"
- **Fix:** Add `JWT_SECRET` to Vercel environment variables

#### ❌ "TypeError: Cannot read property 'headers'"
- **Fix:** Ensure API functions have proper request/response handling

#### ❌ "CORS error"
- **Fix:** Check that CORS headers are set in `api/auth/*.js` files

---

## 🚀 Next Steps (Optional)

### Set Up Custom Domain
1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain (e.g., `rou-ticker.com`)
3. Update DNS records at your domain registrar

### Enable Analytics
1. Go to Settings → Analytics
2. Enable "Web Analytics" to track usage

### Set Up Database Backups
1. Go to Supabase Dashboard
2. Enable automated backups under Settings → Database

---

## 📞 Troubleshooting

### Deployment Failed?
1. Check **"Deployments"** tab in Vercel dashboard
2. Click the failed deployment
3. Check **"Logs"** for error messages
4. Common issues:
   - Missing environment variables
   - Node version mismatch (should be ≥18)
   - Missing dependencies in `package.json`

### API Not Working?
1. Verify environment variables are set
2. Check Supabase database is running
3. Test API endpoints with curl:
```bash
curl -X POST https://your-domain.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'
```

### Still Having Issues?
1. Run locally first: `npm start` (makes sure code works locally)
2. Check Vercel logs: `vercel logs --prod`
3. Verify all environment variables are set
4. Ensure Supabase connection string is correct

---

## ✨ You're All Set!

Your Rou-Ticker app is now:
- ✅ Running on Vercel
- ✅ Auto-deploying from GitHub
- ✅ Connected to Supabase database
- ✅ Using JWT authentication
- ✅ Available at `https://your-vercel-domain.vercel.app`

**Any time you push to GitHub, Vercel automatically deploys your changes!**

---

## 📚 Quick Reference

| Aspect | Link/Location |
|--------|--------------|
| Vercel Dashboard | https://vercel.com/dashboard |
| Your Project Logs | Vercel → Project → Deployments → Logs |
| Environment Variables | Vercel → Settings → Environment Variables |
| Supabase Database | https://supabase.com/dashboard |
| GitHub Repository | https://github.com/TshepoNkosiPy/Routicker |
| Deployed App | `https://your-vercel-domain.vercel.app` |

