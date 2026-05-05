# Vercel Deployment Guide

## Prerequisites
- Vercel account (free at https://vercel.com)
- GitHub repository (recommended)
- Your Supabase DATABASE_URL
- A strong JWT_SECRET

## Step 1: Push Code to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit: Rou-Ticker with Supabase integration"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/rou-ticker.git
git push -u origin main
\`\`\`

## Step 2: Create Vercel Project

1. Go to [Vercel](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Click "Import"

## Step 3: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

### Development & Preview Environment
1. Click **Settings** → **Environment Variables**
2. Add each variable:

| Key | Value | Environments |
|-----|-------|--------------|
| `DATABASE_URL` | Your Supabase connection string | Production, Preview, Development |
| `JWT_SECRET` | Generate a strong random string (e.g., `openssl rand -base64 32`) | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `REACT_APP_API_URL` | `https://your-vercel-domain.vercel.app` | Production |

### How to Find Your Values

**DATABASE_URL:**
- Supabase Dashboard → Project Settings → Database → Connection Strings
- Copy the "URI" version
- Replace `[YOUR-PASSWORD]` with your actual database password

**JWT_SECRET:**
- Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Store securely (never commit to git)

## Step 4: Deploy

1. After adding environment variables, Vercel automatically redeploys
2. Wait for deployment to complete
3. Your app is live at `https://your-vercel-domain.vercel.app`

## Step 5: Verify Deployment

Test your API endpoints:

\`\`\`bash
# Test signup
curl -X POST https://your-vercel-domain.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"pass123"}'

# You should get a response with token
\`\`\`

## Step 6: Update Frontend API URL

Update your frontend to use the production Vercel URL:

In your HTML, change:
\`\`\`javascript
const API_BASE_URL = 'https://your-vercel-domain.vercel.app';
\`\`\`

Or use the environment variable that Vercel set.

## Troubleshooting

### Database Connection Issues

Check Vercel logs:
\`\`\`bash
vercel logs --prod
\`\`\`

Common issues:
- **"password authentication failed"** → DATABASE_URL password is wrong
- **"Connection refused"** → DATABASE_URL host is incorrect
- **"ENOTFOUND"** → Network/firewall issue

### JWT Errors

Make sure JWT_SECRET is set in Vercel environment variables.

### CORS Issues

The API includes CORS headers. If still getting CORS errors:
1. Check browser console for exact error
2. Verify API_BASE_URL is correct
3. Ensure Authorization header is being sent

## Security Checklist

- ✅ Never commit `.env.local` to git
- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ Enable Supabase Row Level Security (RLS)
- ✅ Use HTTPS (Vercel provides this automatically)
- ✅ Rotate JWT_SECRET periodically
- ✅ Monitor Vercel logs for errors

## Production Best Practices

1. **Database Backups**
   - Supabase has daily backups (free tier)
   - Configure point-in-time recovery in Settings

2. **Rate Limiting**
   - Add rate limiting middleware (later enhancement)
   - Vercel provides automatic DDoS protection

3. **Monitoring**
   - Set up Vercel Analytics
   - Monitor error rates and latency

4. **Secrets Management**
   - Use Vercel's environment variables
   - Rotate secrets regularly
   - Never log sensitive data

## Next Steps

1. Test all API endpoints thoroughly
2. Implement rate limiting
3. Add password hashing with bcrypt
4. Set up monitoring/alerting
5. Create database backup strategy
