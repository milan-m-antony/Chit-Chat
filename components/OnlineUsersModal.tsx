'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

interface OnlineUser {
  userId: string;
  username: string;
  online_at: string;
  avatar_style?: string;
}

interface OnlineUsersModalProps {
  users: OnlineUser[];
  onClose: () => void;
}

// Generate avatar image URL based on username and style
const getAvatarUrl = (username: string, style: string = 'avataaars') => {
  const seed = username.toLowerCase();
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

export default function OnlineUsersModal({ users, onClose }: OnlineUsersModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            Online Users ({users.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No users online
            </p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-accent transition"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <Image
                      src={getAvatarUrl(user.username, user.avatar_style || 'avataaars')}
                      alt={user.username}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-background"
                    />
                    {/* Online Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-chart-2 rounded-full border-2 border-card"></div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Online now
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
