# ✨ ChitChat Features Documentation

Complete guide to all features in ChitChat.

## 🎭 Avatar System

### Custom Avatar Styles
Users can choose from 12 different avatar styles:

1. **Cartoon** - Playful cartoon style (avataaars)
2. **Robot** - Cute robot style (bottts)
3. **Persona** - Modern illustrated style
4. **Illustrated** - Hand-drawn style (lorelei)
5. **Notion** - Minimal Notion-style
6. **Adventurer** - Fun character style
7. **Pixel** - Retro 8-bit pixel art
8. **Thumbs** - Thumbs up style
9. **Smile** - Happy face style (big-smile)
10. **Emoji** - Emoji style (fun-emoji)
11. **Micah** - Illustrated style
12. **Mini** - Tiny avatar style (miniavs)

### How It Works
- Avatars are generated using DiceBear API
- Each avatar is unique based on username + style
- Stored in `user_profiles.avatar_style` column
- Updates in real-time for all users
- Click your avatar in header to change style

## 👥 Online Users

### Animated Tooltips
- Hover over user avatars to see their name
- Smooth spring animations powered by Framer Motion
- Shows "Online now" status
- Tooltip appears below avatar (mobile-friendly)

### Online Status
- Real-time presence tracking
- Shows total count including yourself
- Displays other users' avatars (not your own)
- "Only you online" message when alone
- Green dot indicator for online status

## 🔔 Toast Notifications

### Custom Toast System
Built with Radix UI primitives and custom styling:

**Features:**
- Progress bar showing time remaining
- Pause on hover
- Swipe to dismiss
- Auto-dismiss after duration
- Smooth slide-in animations

**Toast Types:**
1. **Success** (Green) - Checkmark icon
   - Avatar updated
   - User joined chat
   
2. **Error** (Red) - X icon
   - Failed to send message
   - Failed to update avatar
   
3. **Info** (Blue) - Info icon
   - General information

**Usage in Code:**
```typescript
toast.success('Message', { description: 'Details', duration: 5000 })
toast.error('Error', { description: 'Details' })
toast.info('Info', { description: 'Details' })
```

## 🌙 Dark Mode

### OKLCH Color System
Uses modern OKLCH color space for:
- Better color consistency
- Smoother gradients
- Perceptually uniform colors

**Theme Variables:**
- Light mode: Bright, clean colors
- Dark mode: Deep blacks with purple-blue accents
- Smooth transitions between modes
- Persists in localStorage

**Toggle:**
- Click moon/sun icon in header
- Keyboard shortcut: (can be added)
- Automatically applies to all components

## 💬 Real-time Messaging

### Message Features
- **Send Messages**: Up to 500 characters
- **Reply**: Thread-like conversations
- **React**: 5 emoji reactions (👍❤️😂😮🔥)
- **Delete**: Remove your own messages
- **Auto-delete**: Messages removed after 24 hours

### Real-time Sync
- Instant message delivery
- Typing indicators
- Presence tracking
- Reaction updates
- Message deletions

### Technical Details
- Uses Supabase Realtime (WebSockets)
- Consistent channel names per room
- Broadcast for typing indicators
- Postgres changes for messages/reactions
- Presence for online users

## 🏠 Multiple Rooms

### Available Rooms
1. **General** - Main chat room
2. **Random** - Off-topic discussions
3. **Tech** - Technology discussions

### Room Features
- Separate message history per room
- Independent online user lists
- Smooth room switching
- Persistent room selection

## 🎨 Message Reactions

### Available Reactions
- 👍 Thumbs up
- ❤️ Heart
- 😂 Laughing
- 😮 Surprised
- 🔥 Fire

### How It Works
- Click emoji button on message
- Select emoji from picker
- One reaction per emoji per user
- Click again to remove
- Real-time updates for all users

## ⌨️ Typing Indicators

### Features
- Shows "[User] is typing..."
- Multiple users: "[User1] and [User2] are typing..."
- 3-second timeout
- Animated dots
- Broadcasts via WebSocket

## 🔒 Security Features

### Row Level Security (RLS)
**Messages:**
- Everyone can view
- Authenticated users can insert
- Users can only delete their own

**Reactions:**
- Everyone can view
- Authenticated users can add
- Users can only delete their own

**User Profiles:**
- Everyone can view
- Users can insert their own
- Users can only update their own

### Authentication
- Email/password authentication
- No email verification required
- Secure session management
- Auto-refresh tokens
- PKCE flow for security

## 📱 Responsive Design

### Mobile Optimizations
- Smaller avatars (40x40 → 48x48 on desktop)
- Compact header on mobile
- "Logout" text hidden on small screens
- Touch-friendly buttons
- Swipeable toasts
- Responsive grid for avatar selector

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## ⚡ Performance Optimizations

### Message Loading
- Limit 100 messages per room
- Efficient queries with indexes
- Pagination ready (can be added)

### Real-time Efficiency
- Single channel per room
- Debounced typing indicators
- Optimized presence updates
- Minimal re-renders with useCallback

### Database Optimization
- Indexes on frequently queried columns
- Auto-delete old messages
- Efficient RLS policies
- Connection pooling

## 🎯 User Experience

### Smooth Animations
- Framer Motion for avatars
- CSS transitions for UI
- Spring physics for tooltips
- Smooth scroll to bottom

### Visual Feedback
- Loading states
- Toast notifications
- Hover effects
- Active states
- Disabled states

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader friendly
- High contrast support

## 🔄 State Management

### Local State
- React useState for UI state
- useRef for channel references
- useCallback for memoization
- useEffect for side effects

### Real-time State
- Supabase Realtime for sync
- Presence for online users
- Broadcast for typing
- Postgres changes for data

### Persistent State
- localStorage for dark mode
- Supabase for user data
- Session management

## 🚀 Future Enhancements

Potential features to add:
- [ ] Voice messages
- [ ] File uploads
- [ ] Message search
- [ ] User mentions (@username)
- [ ] Message editing
- [ ] Read receipts
- [ ] Push notifications
- [ ] Private messages
- [ ] User profiles
- [ ] Custom themes
- [ ] Keyboard shortcuts
- [ ] Message formatting (bold, italic)
- [ ] Code syntax highlighting
- [ ] Link previews
- [ ] GIF support

---

**For technical implementation details, see the source code in `/components` and `/app/chat`**
