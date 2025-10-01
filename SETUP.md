# 🚀 ChitChat - Real-Time Chat Website

A modern, real-time chat application built with Next.js 15, Supabase, and TailwindCSS.

## ✨ Features

- 🔐 Email/Password Authentication (no email verification required)
- 💬 Real-time messaging with Supabase Realtime
- 🎨 Message reactions (👍❤️😂😮🔥)
- 👥 Online user count
- ⌨️ Typing indicators
- 🏷️ Username colors (auto-assigned)
- 💬 Reply to messages
- 😊 Emoji picker
- 🗑️ Manual delete (own messages)
- ⏰ Auto-delete messages after 24 hours
- 🌙 Dark/Light mode
- 📱 Fully responsive design
- 🏠 Multiple chat rooms

## 🛠️ Setup Instructions

### 1. Supabase Setup

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Project Settings → API**
4. Copy your **Project URL** and **anon public** key
5. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here