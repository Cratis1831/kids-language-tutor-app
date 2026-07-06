import { Star } from 'lucide-react';

interface StarsProps {
  count: number;
  total?: number;
  size?: number;
}

/** A row of earned / unearned stars (SVG, from lucide — no emojis). */
export function Stars({ count, total = 3, size = 28 }: StarsProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} / ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const earned = i < count;
        return (
          <Star
            key={i}
            size={size}
            strokeWidth={2}
            className={earned ? 'text-sunshine' : 'text-mist'}
            fill={earned ? 'var(--color-sunshine)' : 'none'}
          />
        );
      })}
    </div>
  );
}
