# 💬 ChitChat - Real-Time Chat Application

A modern, feature-rich real-time chat application built with **Next.js 15**, **Supabase**, and **TailwindCSS**.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)

## ✨ Features

### Core Features
- 🔐 **Email/Password Authentication** - No email verification required
- 💬 **Real-time Messaging** - Instant message delivery with Supabase Realtime
- 🎨 **Message Reactions** - React with emojis (👍❤️😂😮🔥)
- 💬 **Reply to Messages** - Thread-like conversations
- 😊 **Emoji Picker** - Built-in emoji selector
- 🗑️ **Delete Messages** - Remove your own messages
- ⏰ **Auto-Delete** - Messages auto-delete after 24 hours
- 🏠 **Multiple Rooms** - General, Random, and Tech channels

### User Experience
- 👥 **Animated Online Users** - See who's online with beautiful animated avatars
- 🎭 **Custom Avatars** - Choose from 12 different avatar styles
- ⌨️ **Typing Indicators** - Know when others are typing
- 🏷️ **Username Colors** - Auto-assigned unique colors
- 🌙 **Dark/Light Mode** - Beautiful OKLCH color themes
- 🔔 **Toast Notifications** - Custom toast messages with progress bars
- 📱 **Fully Responsive** - Optimized for mobile and desktop
- ✨ **Smooth Animations** - Framer Motion powered interactions

### Security & Performance
- 🔒 **Row Level Security** - Secure database access
- ⚡ **Real-time Sync** - Instant updates across all users
- 🎯 **Optimized Queries** - Fast message loading
- 🔄 **Auto Reconnect** - Handles connection drops gracefully

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier)
- Git

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd chitchat
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/fresh-start.sql` (complete schema with all tables)
3. Go to **Authentication → Providers → Email** and **disable** "Confirm email"
4. Realtime is automatically enabled for all tables in the schema

### 3. Configure Environment

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from **Supabase Dashboard → Project Settings → API**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 📁 Project Structure

```
chitchat/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx      # Login page
│   │   └── signup/page.tsx     # Signup page
│   ├── chat/page.tsx            # Main chat interface
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── animated-tooltip.tsx  # Animated tooltip for avatars
│   │   ├── toast.tsx             # Toast primitives
│   │   ├── toaster.tsx           # Custom toaster with progress
│   │   └── button.tsx            # Button component
│   ├── ChatMessage.tsx           # Message component with reactions
│   ├── MessageInput.tsx          # Input with emoji picker
│   ├── OnlineUsers.tsx           # Animated online users
│   ├── OnlineUsersModal.tsx      # Online users modal
│   ├── ProfilePictureSelector.tsx # Avatar style selector
│   ├── RoomSelector.tsx          # Room switcher
│   └── TypingIndicator.tsx       # Typing status
├── lib/
│   ├── supabase.ts              # Supabase client
│   └── utils.ts                 # Utility functions
├── types/
│   └── index.ts                 # TypeScript types
└── supabase/
    └── schema.sql               # Database schema
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4 (OKLCH colors)
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime (WebSockets)
- **Authentication**: Supabase Auth
- **Animations**: Framer Motion
- **UI Components**: 
  - Radix UI (Toast primitives)
  - Lucide Icons
  - Emoji Picker React
  - DiceBear Avatars
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide

## 🎯 Usage

1. **Sign Up**: Create an account with email, password, and username
2. **Login**: Access your account
3. **Select Room**: Choose from General, Random, or Tech
4. **Chat**: Send messages, react, reply, and see who's online
5. **Dark Mode**: Toggle theme in the top right corner

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only delete their own messages
- Secure authentication with Supabase Auth
- Environment variables for sensitive data
- Rate limiting on message creation

## 📊 Storage Optimization

- Auto-delete messages after 24 hours (cron job)
- Character limit: 500 characters per message
- Efficient queries with pagination
- Minimal database footprint

## 🆓 Free Tier Limits

**Supabase Free Tier:**
- 500MB database storage
- 2GB bandwidth/month
- 50,000 monthly active users
- Unlimited API requests

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

**Estimated Capacity**: 10,000+ messages/day with auto-delete enabled

## 🐛 Troubleshooting

### Messages not appearing in real-time
- Check Supabase Realtime is enabled for tables
- Verify RLS policies are correct
- Check browser console for errors

### Can't login after signup
- Ensure email confirmation is disabled in Supabase
- Check `.env.local` has correct credentials

### Auto-delete not working
- Verify `pg_cron` extension is enabled
- Check cron job is scheduled correctly

See [DEPLOYMENT.md](./DEPLOYMENT.md) for more troubleshooting tips.

## 🚀 Deployment

Deploy to production in minutes:

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

MIT License - Feel free to use for personal or commercial projects!

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Emoji Picker React](https://www.npmjs.com/package/emoji-picker-react)

---

**Made with ❤️ by [Your Name]**

⭐ Star this repo if you find it helpful!
