'use client';

interface TypingIndicatorProps {
  usernames: string[];
}

export default function TypingIndicator({ usernames }: TypingIndicatorProps) {
  if (usernames.length === 0) return null;

  const displayText =
    usernames.length === 1
      ? `${usernames[0]} is typing...`
      : usernames.length === 2
      ? `${usernames[0]} and ${usernames[1]} are typing...`
      : `${usernames[0]} and ${usernames.length - 1} others are typing...`;

  return (
    <div className="px-4 py-2 text-sm text-muted-foreground italic">
      {displayText}
      <span className="inline-flex gap-1 ml-1">
        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
      </span>
    </div>
  );
}
