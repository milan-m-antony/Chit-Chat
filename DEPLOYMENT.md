# 🚀 Deployment Guide - ChitChat

Complete guide to deploy your ChitChat application to production.

## Prerequisites

- ✅ Supabase account (free tier)
- ✅ Vercel account (free tier)
- ✅ GitHub account
- ✅ Git installed locally

---

## Step 1: Set Up Supabase (Backend)

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `chitchat` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

### 1.2 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `supabase/schema.sql` from your project
4. Paste into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see: "Success. No rows returned"

### 1.3 Disable Email Confirmation

1. Go to **Authentication → Providers**
2. Click on **Email** provider
3. Scroll down to **"Confirm email"**
4. **Toggle OFF** the "Confirm email" option
5. Click **"Save"**

### 1.4 Enable Realtime

1. Go to **Database → Replication**
2. Find the `messages` table
3. Enable **"Realtime"** toggle
4. Find the `reactions` table
5. Enable **"Realtime"** toggle

### 1.5 Set Up Auto-Delete Cron Job (Optional)

1. Go to **Database → Extensions**
2. Search for `pg_cron`
3. Enable the extension
4. Go to **SQL Editor** and run:

```sql
SELECT cron.schedule(
  'delete-old-messages',
  '0 2 * * *', -- Runs at 2 AM daily
  $$SELECT delete_old_messages()$$
);
```

### 1.6 Get API Credentials

1. Go to **Project Settings → API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

---

## Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: ChitChat application"
```

### 2.2 Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `chitchat`
3. Make it **Public** or **Private** (your choice)
4. **DO NOT** initialize with README (you already have one)
5. Click **"Create repository"**

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/chitchat.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel (Frontend)

### 3.1 Import Project

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New..." → "Project"**
3. Import your GitHub repository (`chitchat`)
4. Click **"Import"**

### 3.2 Configure Environment Variables

1. In the deployment settings, find **"Environment Variables"**
2. Add these variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key |

3. Click **"Deploy"**

### 3.3 Wait for Deployment

- Vercel will build and deploy your app (takes 2-3 minutes)
- You'll get a URL like: `https://chitchat-xxxxx.vercel.app`

---

## Step 4: Test Your Deployment

### 4.1 Visit Your Site

1. Open your Vercel URL
2. You should see the ChitChat landing page

### 4.2 Create Test Account

1. Click **"Get Started"**
2. Sign up with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `test123`
3. You should be redirected to `/chat`

### 4.3 Test Features

- ✅ Send a message
- ✅ React to a message (click 😊)
- ✅ Reply to a message
- ✅ Switch rooms (General, Random, Tech)
- ✅ Toggle dark mode
- ✅ Check online user count

---

## Step 5: Custom Domain (Optional)

### 5.1 Add Domain in Vercel

1. In Vercel project settings, go to **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `chitchat.yourdomain.com`)
4. Follow DNS configuration instructions

### 5.2 Update Supabase Redirect URLs

1. In Supabase, go to **Authentication → URL Configuration**
2. Add your custom domain to **"Site URL"**
3. Add to **"Redirect URLs"**:
   - `https://yourdomain.com/**`
   - `https://yourdomain.com/auth/callback`

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: 
- Check `.env.local` has correct values
- In Vercel, verify environment variables are set
- Redeploy after adding variables

### Issue: Messages not appearing in real-time

**Solution**:
- Verify Realtime is enabled for `messages` and `reactions` tables
- Check browser console for WebSocket errors
- Ensure RLS policies are correctly set

### Issue: Can't login after signup

**Solution**:
- Verify email confirmation is disabled in Supabase
- Check Supabase Auth logs for errors
- Ensure environment variables are correct

### Issue: Auto-delete not working

**Solution**:
- Verify `pg_cron` extension is enabled
- Check cron job is scheduled correctly
- Run manually: `SELECT delete_old_messages();`

---

## Monitoring & Maintenance

### Check Supabase Usage

1. Go to **Project Settings → Usage**
2. Monitor:
   - Database size (500MB limit on free tier)
   - Bandwidth (2GB/month limit)
   - Active users

### Check Vercel Usage

1. Go to **Project Settings → Usage**
2. Monitor:
   - Bandwidth (100GB/month on free tier)
   - Build minutes
   - Serverless function executions

### Update Application

```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push

# Vercel will automatically redeploy
```

---

## Performance Optimization

### 1. Enable Caching

Add to `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    unoptimized: false,
  },
  compress: true,
};
```

### 2. Add Analytics (Optional)

- Vercel Analytics (free)
- Google Analytics
- Plausible Analytics

### 3. Monitor Errors

- Set up Sentry for error tracking
- Use Vercel's built-in error monitoring

---

## Security Best Practices

1. ✅ Never commit `.env.local` to Git (already in `.gitignore`)
2. ✅ Rotate Supabase keys if exposed
3. ✅ Enable 2FA on Supabase and Vercel accounts
4. ✅ Regularly update dependencies: `npm update`
5. ✅ Monitor Supabase Auth logs for suspicious activity

---

## Scaling Considerations

### When to Upgrade from Free Tier

**Supabase Pro ($25/month)**:
- Database > 500MB
- Bandwidth > 2GB/month
- Need more than 50,000 MAU

**Vercel Pro ($20/month)**:
- Need custom domains
- Bandwidth > 100GB/month
- Need team collaboration

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Report bugs in your repository

---

## Congratulations! 🎉

Your ChitChat application is now live and ready to use!

**Share your deployment URL and start chatting!**
