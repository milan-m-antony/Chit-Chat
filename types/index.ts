export interface Message {
  id: string;
  user_id: string;
  username: string;
  user_color: string;
  room: string;
  content: string;
  reply_to?: string | null;
  reply_to_content?: string | null;
  reply_to_username?: string | null;
  created_at: string;
  reactions?: Reaction[];
}

export interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  color: string;
  avatar_style: string;
  created_at: string;
}

export interface TypingUser {
  userId: string;
  username: string;
  timestamp: number;
}

export interface CustomRoom {
  id: string;
  name: string;
  password: string;
  created_by: string;
  created_at: string;
}

export type Room = 'general' | string;
