'use client';

import { Room } from '@/types';
import { Hash } from 'lucide-react';

interface RoomSelectorProps {
  currentRoom: Room;
  onRoomChange: (room: Room) => void;
}

const ROOMS: { id: Room; name: string; description: string }[] = [
  { id: 'general', name: 'General', description: 'General discussion' },
  { id: 'random', name: 'Random', description: 'Random topics' },
  { id: 'tech', name: 'Tech', description: 'Technology talk' },
];

export default function RoomSelector({ currentRoom, onRoomChange }: RoomSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {ROOMS.map((room) => (
        <button
          key={room.id}
          onClick={() => onRoomChange(room.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
            currentRoom === room.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:bg-accent'
          }`}
        >
          <Hash size={18} />
          <div className="text-left">
            <div className="font-semibold text-sm">{room.name}</div>
            <div className="text-xs opacity-75">{room.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
