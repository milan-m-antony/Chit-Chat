'use client';

import { useState } from 'react';
import { Message, Reaction } from '@/types';
import { formatTime } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Trash2, Reply } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  currentUserId: string;
  onReply: (message: Message) => void;
}

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '🔥'];

export default function ChatMessage({ message, currentUserId, onReply }: ChatMessageProps) {
  const [showReactions, setShowReactions] = useState(false);
  const isOwnMessage = message.user_id === currentUserId;

  const handleReaction = async (emoji: string) => {
    try {
      // Check if user already reacted with this emoji
      const existingReaction = message.reactions?.find(
        (r) => r.user_id === currentUserId && r.emoji === emoji
      );

      if (existingReaction) {
        // Remove reaction
        await supabase.from('reactions').delete().eq('id', existingReaction.id);
      } else {
        // Add reaction
        await supabase.from('reactions').insert({
          message_id: message.id,
          user_id: currentUserId,
          emoji,
        });
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
    setShowReactions(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this message?')) return;
    
    try {
      await supabase.from('messages').delete().eq('id', message.id);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Group reactions by emoji
  const groupedReactions = message.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = { count: 0, userIds: [] };
    }
    acc[reaction.emoji].count++;
    acc[reaction.emoji].userIds.push(reaction.user_id);
    return acc;
  }, {} as Record<string, { count: number; userIds: string[] }>);

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Reply indicator */}
        {message.reply_to_content && (
          <div className="mb-1 px-3 py-1 bg-muted rounded-lg text-xs opacity-75">
            <span className="font-semibold">{message.reply_to_username}: </span>
            <span className="italic">{message.reply_to_content.substring(0, 50)}...</span>
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          }`}
        >
          {!isOwnMessage && (
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-semibold text-sm"
                style={{ color: isOwnMessage ? 'white' : message.user_color }}
              >
                {message.username}
              </span>
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* Reactions */}
        {groupedReactions && Object.keys(groupedReactions).length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(groupedReactions).map(([emoji, data]) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 transition ${
                  data.userIds.includes(currentUserId)
                    ? 'bg-accent ring-1 ring-ring'
                    : 'bg-muted hover:bg-accent'
                }`}
              >
                <span>{emoji}</span>
                <span className="text-muted-foreground">{data.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition">
          <span className="text-xs text-muted-foreground">
            {formatTime(message.created_at)}
          </span>
          
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            😊
          </button>

          <button
            onClick={() => onReply(message)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <Reply size={14} />
          </button>

          {isOwnMessage && (
            <button
              onClick={handleDelete}
              className="text-xs text-destructive hover:opacity-80"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Reaction picker */}
        {showReactions && (
          <div className="flex gap-1 mt-1 bg-card rounded-lg p-2 shadow-lg border border-border">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="text-xl hover:scale-125 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
