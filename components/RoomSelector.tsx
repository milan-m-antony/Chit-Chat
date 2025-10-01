'use client';

import { Room, CustomRoom } from '@/types';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Lock } from 'lucide-react';

interface RoomSelectorProps {
  currentRoom: Room;
  onRoomChange: (room: Room) => void;
  userId: string;
}

export default function RoomSelector({ currentRoom, onRoomChange, userId }: RoomSelectorProps) {
  const [joinedRooms, setJoinedRooms] = useState<string[]>([]);
  const [customRooms, setCustomRooms] = useState<CustomRoom[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');

  useEffect(() => {
    // Load joined rooms from localStorage
    const saved = localStorage.getItem(`joinedRooms_${userId}`);
    if (saved) {
      const rooms = JSON.parse(saved);
      setJoinedRooms(rooms);
      loadCustomRooms(rooms);
    }
  }, [userId]);

  const loadCustomRooms = async (roomIds: string[]) => {
    if (roomIds.length === 0) {
      setCustomRooms([]);
      return;
    }
    
    const { data } = await supabase
      .from('custom_rooms')
      .select('*')
      .in('id', roomIds)
      .order('created_at', { ascending: false });
    
    if (data) {
      setCustomRooms(data);
    }
  };

  const saveJoinedRoom = (roomId: string) => {
    const updated = [...new Set([...joinedRooms, roomId])];
    setJoinedRooms(updated);
    localStorage.setItem(`joinedRooms_${userId}`, JSON.stringify(updated));
    loadCustomRooms(updated);
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim() || !roomPassword.trim()) {
      alert('Please enter both room name and password');
      return;
    }

    const roomId = roomName.toLowerCase().replace(/\s+/g, '-');
    
    const { error } = await supabase
      .from('custom_rooms')
      .insert({
        id: roomId,
        name: roomName,
        password: roomPassword,
        created_by: userId,
      });

    if (error) {
      alert('Failed to create room. Room ID might already exist.');
      return;
    }

    setShowCreateModal(false);
    setRoomName('');
    setRoomPassword('');
    saveJoinedRoom(roomId);
    onRoomChange(roomId);
  };

  const handleJoinRoom = async () => {
    if (!joinRoomId.trim() || !joinPassword.trim()) {
      alert('Please enter both room ID and password');
      return;
    }

    const { data } = await supabase
      .from('custom_rooms')
      .select('*')
      .eq('id', joinRoomId.toLowerCase())
      .eq('password', joinPassword)
      .single();

    if (!data) {
      alert('Invalid room ID or password');
      return;
    }

    setShowJoinModal(false);
    setJoinRoomId('');
    setJoinPassword('');
    saveJoinedRoom(data.id);
    onRoomChange(data.id);
  };

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {/* General Room */}
        <button
          onClick={() => onRoomChange('general')}
          className={`px-3 md:px-4 py-2 rounded-lg transition whitespace-nowrap text-xs md:text-sm ${
            currentRoom === 'general'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}
        >
          <div className="font-semibold">General</div>
          <div className="text-xs opacity-80 hidden md:block">Main discussion</div>
        </button>

        {/* Custom Rooms */}
        {customRooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomChange(room.id)}
            className={`px-3 md:px-4 py-2 rounded-lg transition whitespace-nowrap text-xs md:text-sm flex items-center gap-1 ${
              currentRoom === room.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            <Lock size={12} />
            <div className="font-semibold">{room.name}</div>
          </button>
        ))}

        {/* Create Room Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 md:px-4 py-2 rounded-lg transition whitespace-nowrap bg-accent hover:bg-accent/80 text-xs md:text-sm flex items-center gap-1"
        >
          <Plus size={14} />
          <span className="hidden md:inline">Create</span>
        </button>

        {/* Join Room Button */}
        <button
          onClick={() => setShowJoinModal(true)}
          className="px-3 md:px-4 py-2 rounded-lg transition whitespace-nowrap bg-accent hover:bg-accent/80 text-xs md:text-sm flex items-center gap-1"
        >
          <Lock size={14} />
          <span className="hidden md:inline">Join</span>
        </button>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create Private Room</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g., Lab Discussion"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="text"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="e.g., lab@123"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Room ID will be: {roomName.toLowerCase().replace(/\s+/g, '-') || 'room-id'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateRoom}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Join Private Room</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Room ID</label>
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  placeholder="e.g., lab-discussion"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  placeholder="Enter room password"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleJoinRoom}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
                >
                  Join
                </button>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
