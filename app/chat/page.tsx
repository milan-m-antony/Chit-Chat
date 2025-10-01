'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Message, Room, TypingUser } from '@/types';
import Image from 'next/image';
import { toast } from '@/components/ui/toaster';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import OnlineUsers from '@/components/OnlineUsers';
import OnlineUsersModal from '@/components/OnlineUsersModal';
import ProfilePictureSelector from '@/components/ProfilePictureSelector';
import RoomSelector from '@/components/RoomSelector';
import TypingIndicator from '@/components/TypingIndicator';
import { LogOut, Moon, Sun, Settings } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room>('general');
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [userColor, setUserColor] = useState<string>('');
  const [avatarStyle, setAvatarStyle] = useState<string>('avataaars');
  const [onlineCount, setOnlineCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [onlineUsersList, setOnlineUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  // Initialize user and check auth
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initUser = async () => {
      try {
        console.log('Initializing user...');
        
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted && isLoading) {
            console.log('Loading timeout - redirecting to login');
            setIsLoading(false);
            window.location.href = '/auth/login';
          }
        }, 5000); // 5 second timeout
        
        // Force refresh session to get latest user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!mounted) {
          clearTimeout(timeoutId);
          return;
        }

        if (sessionError || !session) {
          console.log('No valid session, redirecting to login');
          clearTimeout(timeoutId);
          setIsLoading(false);
          window.location.href = '/auth/login';
          return;
        }

        const user = session.user;
        console.log('Current user ID:', user.id);
        
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        console.log('Profile query result:', { profile, profileError });

        if (!mounted) {
          clearTimeout(timeoutId);
          return;
        }

        if (profileError || !profile) {
          console.error('Error loading profile:', profileError);
          console.log('No profile found for user:', user.id);
          // Profile doesn't exist, redirect to login
          await supabase.auth.signOut();
          clearTimeout(timeoutId);
          setIsLoading(false);
          window.location.href = '/auth/login';
          return;
        }

        console.log('Loaded profile successfully:', profile);
        setUserId(user.id);
        setUsername(profile.username);
        setUserColor(profile.color);
        setAvatarStyle(profile.avatar_style || 'avataaars');
        clearTimeout(timeoutId);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in initUser:', error);
        if (mounted) {
          clearTimeout(timeoutId);
          setIsLoading(false);
          window.location.href = '/auth/login';
        }
      }
    };

    initUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        setIsLoading(false);
        router.push('/auth/login');
      } else if (event === 'SIGNED_IN' && session) {
        // Reload user data
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUserId(session.user.id);
          setUsername(profile.username);
          setUserColor(profile.color);
          setAvatarStyle(profile.avatar_style || 'avataaars');
          setIsLoading(false);
        }
      }
    });

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible - checking session');
        // Refresh session when tab becomes visible
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!session) {
            console.log('No session found after tab switch');
            window.location.href = '/auth/login';
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, isLoading]);

  // Check for dark mode preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId || !username) {
      console.log('Waiting for userId and username...', { userId, username });
      return;
    }

    console.log('Setting up real-time for room:', currentRoom, 'User:', username);

    // Subscribe to messages and reactions
    // Use consistent channel name (don't use Date.now() as it changes on every render)
    const channel = supabase
      .channel(`room:${currentRoom}`, {
        config: {
          broadcast: { self: true },
          presence: { key: userId },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room=eq.${currentRoom}`,
        },
        async (payload) => {
          console.log('New message received:', payload.new);
          const newMessage = payload.new as Message;
          // Load reactions for the new message
          const { data: reactions } = await supabase
            .from('reactions')
            .select('*')
            .eq('message_id', newMessage.id);
          
          newMessage.reactions = reactions || [];
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('Message deleted:', payload.old.id);
          setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reactions',
        },
        async () => {
          console.log('Reactions updated');
          // Reload messages to get updated reactions
          loadMessages();
        }
      )
      .on('presence', { event: 'sync' }, async () => {
        const state = channel.presenceState();
        const allUsers = Object.values(state).flat() as any[];
        
        console.log('Presence sync - raw users:', allUsers);
        
        // Fetch avatar styles and usernames from database for all users
        const userIds = allUsers.map((u: any) => u.userId).filter(Boolean);
        
        if (userIds.length === 0) {
          setOnlineUsersList([]);
          setOnlineCount(0);
          return;
        }
        
        const { data: profiles, error } = await supabase
          .from('user_profiles')
          .select('id, username, avatar_style')
          .in('id', userIds);
        
        if (error) {
          console.error('Error fetching profiles:', error);
        }
        
        console.log('Fetched profiles:', profiles);
        
        // Map avatar styles to users
        const usersWithAvatars = allUsers.map((user: any) => {
          const profile = profiles?.find((p) => p.id === user.userId);
          return {
            userId: user.userId,
            username: profile?.username || user.username || 'Unknown',
            avatar_style: profile?.avatar_style || user.avatar_style || 'avataaars',
            online_at: user.online_at || new Date().toISOString(),
          };
        });
        
        // Filter out current user from the list
        const otherUsers = usersWithAvatars.filter((user: any) => user.userId !== userId);
        const totalCount = allUsers.length; // Total including yourself
        
        console.log('Processed users:', { totalCount, otherUsers });
        
        // Check for new users
        const previousUserIds = onlineUsersList.map((u: any) => u.userId);
        const newUsers = otherUsers.filter((u: any) => !previousUserIds.includes(u.userId));
        
        if (newUsers.length > 0) {
          newUsers.forEach((user: any) => {
            toast.success(`${user.username} joined the chat`, {
              description: 'Say hello! 👋',
              duration: 4000,
            });
          });
        }
        
        setOnlineCount(totalCount);
        setOnlineUsersList(otherUsers); // Only show other users
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== userId) {
          setTypingUsers((prev) => {
            const filtered = prev.filter((u) => u.userId !== payload.userId);
            return [...filtered, { ...payload, timestamp: Date.now() }];
          });
        }
      })
      .subscribe(async (status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to room:', currentRoom);
          await channel.track({
            userId,
            username,
            avatar_style: avatarStyle,
            online_at: new Date().toISOString(),
          });
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Channel error - retrying...');
        } else if (status === 'TIMED_OUT') {
          console.error('Subscription timed out');
        }
      });

    channelRef.current = channel;

    // Clean up typing indicators
    const typingInterval = setInterval(() => {
      setTypingUsers((prev) =>
        prev.filter((u) => Date.now() - u.timestamp < 3000)
      );
    }, 1000);

    return () => {
      console.log('Cleaning up channel for room:', currentRoom);
      channel.unsubscribe();
      clearInterval(typingInterval);
    };
  }, [currentRoom, userId, username]);

  const loadMessages = useCallback(async () => {
    if (!currentRoom) return;
    
    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .eq('room', currentRoom)
      .order('created_at', { ascending: true })
      .limit(100);

    if (messagesData) {
      // Load reactions for all messages
      const messageIds = messagesData.map((m) => m.id);
      const { data: reactionsData } = await supabase
        .from('reactions')
        .select('*')
        .in('message_id', messageIds);

      const messagesWithReactions = messagesData.map((msg) => ({
        ...msg,
        reactions: reactionsData?.filter((r) => r.message_id === msg.id) || [],
      }));

      setMessages(messagesWithReactions);
      scrollToBottom();
    }
  }, [currentRoom]);

  // Separate effect to handle room changes and reload messages
  useEffect(() => {
    if (!userId) return;
    
    console.log('Room changed to:', currentRoom);
    loadMessages();
  }, [currentRoom, userId, loadMessages]);

  const handleSendMessage = async (content: string, retryCount = 0) => {
    if (!userId || !username) {
      console.error('User not authenticated');
      alert('Please refresh the page and try again.');
      return;
    }

    try {
      const messageData: any = {
        user_id: userId,
        username,
        user_color: userColor,
        room: currentRoom,
        content,
      };

      if (replyTo) {
        messageData.reply_to = replyTo.id;
        messageData.reply_to_content = replyTo.content;
        messageData.reply_to_username = replyTo.username;
      }

      console.log('Sending message:', messageData);
      const { data, error } = await supabase.from('messages').insert(messageData).select();
      
      if (error) {
        console.error('Error sending message:', error);
        
        // Retry once if it fails
        if (retryCount < 1) {
          console.log('Retrying message send...');
          setTimeout(() => handleSendMessage(content, retryCount + 1), 1000);
          return;
        }
        
        toast.error('Failed to send message: ' + error.message);
        return;
      }
      
      console.log('Message sent successfully:', data);
      setReplyTo(null);
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      if (retryCount < 1) {
        setTimeout(() => handleSendMessage(content, retryCount + 1), 1000);
        return;
      }
      
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleTyping = () => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId, username },
      });
    }
  };

  const handleDeleteAllMessages = async () => {
    if (!confirm('Are you sure you want to delete ALL messages in this room? This cannot be undone!')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('room', currentRoom);

      if (error) throw error;

      toast.success('All messages deleted', {
        description: 'The room has been cleared',
      });
      
      // Reload messages
      loadMessages();
    } catch (error) {
      console.error('Error deleting messages:', error);
      toast.error('Failed to delete messages', {
        description: 'Please try again',
      });
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      
      // Unsubscribe from channel first
      if (channelRef.current) {
        console.log('Unsubscribing from channel...');
        await channelRef.current.unsubscribe();
      }

      // Sign out from Supabase
      console.log('Signing out from Supabase...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }

      // Clear local state
      setUserId('');
      setUsername('');
      setUserColor('');
      setAvatarStyle('avataaars');
      setMessages([]);
      setOnlineUsersList([]);

      console.log('Logout successful, redirecting...');
      
      // Force redirect
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect anyway
      window.location.href = '/auth/login';
    }
  };

  const handleAvatarChange = async (newAvatarStyle: string) => {
    try {
      console.log('Updating avatar to:', newAvatarStyle);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ avatar_style: newAvatarStyle })
        .eq('id', userId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      // Update local state
      setAvatarStyle(newAvatarStyle);
      console.log('Avatar style updated successfully');

      // Update presence with new avatar - force update
      if (channelRef.current) {
        await channelRef.current.untrack();
        await channelRef.current.track({
          userId,
          username,
          avatar_style: newAvatarStyle,
          online_at: new Date().toISOString(),
        });
      }

      // Close modal after successful update
      setShowProfileSettings(false);
      
      toast.success('Avatar updated successfully!', {
        description: 'Your new avatar is now visible to everyone',
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar', {
        description: 'Please try again',
      });
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    console.log('Toggling dark mode:', newMode);
    setDarkMode(newMode);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(newMode));
      
      const html = document.documentElement;
      if (newMode) {
        html.classList.add('dark');
        console.log('Added dark class, classes:', html.className);
      } else {
        html.classList.remove('dark');
        console.log('Removed dark class, classes:', html.className);
      }
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const typingUsernames = typingUsers.map((u) => u.username);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render chat if no username (still loading or not authenticated)
  if (!username || !userId) {
    // Prevent infinite loading by redirecting
    if (typeof window !== 'undefined') {
      router.push('/auth/login');
    }
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground" suppressHydrationWarning>
      {/* Header */}
      <div className="bg-card border-b border-border p-2 md:p-4">
        <div className="flex items-center justify-between mb-2 md:mb-4 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* User Avatar - Clickable */}
            <button 
              onClick={() => setShowProfileSettings(true)}
              className="relative group cursor-pointer flex-shrink-0"
              title="Change Avatar"
            >
              <Image
                src={`https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${username.toLowerCase()}`}
                alt={username}
                width={40}
                height={40}
                className="rounded-full border-2 border-primary group-hover:border-accent transition-colors w-8 h-8 md:w-12 md:h-12"
                unoptimized
              />
            </button>
            {/* User Info */}
            <div className="min-w-0 flex-1">
              <h1 className="text-sm md:text-2xl font-bold text-foreground truncate">ChitChat</h1>
              <p className="text-xs text-muted-foreground truncate hidden sm:block">Welcome, {username}!</p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <button onClick={() => setShowOnlineUsers(true)} className="cursor-pointer hidden md:block">
              <OnlineUsers users={onlineUsersList} />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-1.5 md:p-2 rounded-lg bg-muted hover:bg-accent transition text-foreground"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={16} className="md:w-5 md:h-5" /> : <Moon size={16} className="md:w-5 md:h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 bg-destructive hover:opacity-90 text-destructive-foreground rounded-lg transition text-xs md:text-base"
            >
              <LogOut size={14} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <RoomSelector currentRoom={currentRoom} onRoomChange={setCurrentRoom} userId={userId} />
          <button
            onClick={handleDeleteAllMessages}
            className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition flex-shrink-0"
            title="Delete all messages in this room"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm md:text-base text-muted-foreground text-center px-4">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              currentUserId={userId}
              onReply={setReplyTo}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUsernames.length > 0 && <TypingIndicator usernames={typingUsernames} />}

      {/* Message Input */}
      <MessageInput
        onSend={handleSendMessage}
        onTyping={handleTyping}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />

      {/* Online Users Modal */}
      {showOnlineUsers && (
        <OnlineUsersModal
          users={onlineUsersList}
          onClose={() => setShowOnlineUsers(false)}
        />
      )}

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Profile Settings</h2>
              <button
                onClick={() => setShowProfileSettings(false)}
                className="p-2 hover:bg-muted rounded-lg transition"
              >
                <span className="text-2xl text-muted-foreground">&times;</span>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Choose Your Avatar Style</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select an avatar style that represents you
                </p>
                <ProfilePictureSelector
                  currentAvatar={avatarStyle}
                  username={username}
                  onSelect={handleAvatarChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
