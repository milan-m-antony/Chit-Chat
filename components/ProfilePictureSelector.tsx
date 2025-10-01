'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

interface ProfilePictureSelectorProps {
  currentAvatar: string;
  username: string;
  onSelect: (avatarStyle: string) => void;
}

const AVATAR_STYLES = [
  { id: 'avataaars', name: 'Cartoon', description: 'Playful cartoon' },
  { id: 'bottts', name: 'Robot', description: 'Cute robot' },
  { id: 'personas', name: 'Persona', description: 'Modern style' },
  { id: 'lorelei', name: 'Illustrated', description: 'Hand drawn' },
  { id: 'notionists', name: 'Notion', description: 'Minimal style' },
  { id: 'adventurer', name: 'Adventurer', description: 'Fun character' },
  { id: 'pixel-art', name: 'Pixel', description: 'Retro 8-bit' },
  { id: 'thumbs', name: 'Thumbs', description: 'Thumbs up' },
  { id: 'big-smile', name: 'Smile', description: 'Happy face' },
  { id: 'fun-emoji', name: 'Emoji', description: 'Emoji style' },
  { id: 'micah', name: 'Micah', description: 'Illustrated' },
  { id: 'miniavs', name: 'Mini', description: 'Tiny avatar' },
];

export default function ProfilePictureSelector({
  currentAvatar,
  username,
  onSelect,
}: ProfilePictureSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState(currentAvatar);

  const getAvatarUrl = (style: string) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${username.toLowerCase()}`;
  };

  const handleSelect = (style: string) => {
    setSelectedStyle(style);
    onSelect(style);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {AVATAR_STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => handleSelect(style.id)}
          className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition hover:bg-accent ${
            selectedStyle === style.id
              ? 'border-primary bg-accent'
              : 'border-border'
          }`}
        >
          {selectedStyle === style.id && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
              <Check size={16} />
            </div>
          )}
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
            <Image
              src={getAvatarUrl(style.id)}
              alt={style.name}
              width={80}
              height={80}
              className="rounded-full object-cover"
              unoptimized
              onError={(e) => {
                console.error('Failed to load avatar:', style.id);
              }}
            />
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm text-foreground">{style.name}</p>
            <p className="text-xs text-muted-foreground">{style.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
