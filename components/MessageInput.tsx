'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Smile, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { Message } from '@/types';

interface MessageInputProps {
  onSend: (content: string) => void;
  onTyping: () => void;
  replyTo: Message | null;
  onCancelReply: () => void;
}

export default function MessageInput({ onSend, onTyping, replyTo, onCancelReply }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && message.length <= 500) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    onTyping();
    typingTimeoutRef.current = setTimeout(() => {
      // Stop typing after 2 seconds of inactivity
    }, 2000);
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-border bg-card p-4">
      {/* Reply indicator */}
      {replyTo && (
        <div className="mb-2 flex items-center justify-between bg-muted rounded-lg p-2">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              Replying to <span className="font-semibold">{replyTo.username}</span>
            </p>
            <p className="text-sm text-foreground truncate">
              {replyTo.content}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for new line)"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none max-h-32"
            rows={1}
            maxLength={500}
          />
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3 bottom-3 text-muted-foreground hover:text-foreground"
          >
            <Smile size={20} />
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim() || message.length > 500}
          className="bg-primary hover:opacity-90 text-primary-foreground p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>

      <div className="mt-1 text-xs text-right text-muted-foreground">
        {message.length}/500
      </div>
    </div>
  );
}
