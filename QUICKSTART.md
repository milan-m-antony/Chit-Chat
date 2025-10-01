# ⚡ Quick Start Guide - ChitChat

Get your chat app running in **5 minutes**!

## Step 1: Update Environment Variables (2 min)

1. Open `.env.local` in your project root
2. Go to [supabase.com](https://supabase.com) and create a new project
3. Once created, go to **Project Settings → API**
4. Copy your credentials and update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 2: Set Up Database (2 min)

1. In Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Open `supabase/schema.sql` from your project
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for "Success. No rows returned" message

## Step 3: Disable Email Confirmation (30 sec)

1. In Supabase, go to **Authentication → Providers**
2. Click on **Email**
3. Scroll down and **toggle OFF** "Confirm email"
4. Click **Save**

## Step 4: Enable Realtime (30 sec)

1. Go to **Database → Replication**
2. Find `messages` table and enable **Realtime** toggle
3. Find `reactions` table and enable **Realtime** toggle

## Step 5: Run the App! (10 sec)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Test It Out

1. Click **"Get Started"**
2. Create an account:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Start chatting!

## 🎉 That's It!

Your chat app is now running locally. 

### Next Steps:

- **Deploy to production**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Customize features**: Edit files in `app/` and `components/`
- **Add more rooms**: Update `components/RoomSelector.tsx`

## 🆘 Having Issues?

### "Missing Supabase environment variables"
- Make sure `.env.local` has correct values
- Restart dev server: `Ctrl+C` then `npm run dev`

### "Can't login after signup"
- Check email confirmation is disabled in Supabase
- Verify environment variables are correct

### "Messages not appearing"
- Enable Realtime for `messages` and `reactions` tables
- Check browser console for errors

### Still stuck?
- Check [SETUP.md](./SETUP.md) for detailed instructions
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting

---

**Happy Chatting! 💬**
