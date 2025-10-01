'use client';

import { AnimatedTooltip } from '@/components/ui/animated-tooltip';

interface OnlineUser {
  userId: string;
  username: string;
  online_at: string;
  avatar_style?: string;
}

interface OnlineUsersProps {
  users: OnlineUser[];
}

// Generate avatar image URL based on username and style
const getAvatarUrl = (username: string, style: string = 'avataaars') => {
  const seed = username.toLowerCase();
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

export default function OnlineUsers({ users }: OnlineUsersProps) {
  if (users.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-muted-foreground text-sm">
        Only you online
      </div>
    );
  }

  const tooltipItems = users.map((user, index) => ({
    id: index,
    name: user.username,
    designation: 'Online now',
    image: getAvatarUrl(user.username, user.avatar_style || 'avataaars'),
  }));

  return (
    <div className="flex items-center gap-2">
      <AnimatedTooltip items={tooltipItems} />
      <span className="text-sm font-medium text-muted-foreground hidden md:inline">
        +{users.length} other {users.length === 1 ? 'user' : 'users'}
      </span>
    </div>
  );
}
