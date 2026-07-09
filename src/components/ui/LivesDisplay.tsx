import { Heart } from 'lucide-react';
import { LIVES_MAX } from '../../config/gameRules';

interface LivesDisplayProps {
  lives: number;
  size?: number;
}

/**
 * A row of LIVES_MAX hearts showing remaining lives. Full hearts are filled
 * berry, spent hearts are a muted outline, and a half life is a filled heart
 * clipped to its left half over the outline — all SVG (lucide Heart), no emoji.
 */
export function LivesDisplay({ lives, size = 20 }: LivesDisplayProps) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${lives} / ${LIVES_MAX}`}
    >
      {Array.from({ length: LIVES_MAX }).map((_, i) => {
        const fill = lives >= i + 1 ? 'full' : lives >= i + 0.5 ? 'half' : 'empty';
        return (
          <span
            key={i}
            className="relative inline-block leading-none"
            style={{ width: size, height: size }}
          >
            <Heart
              size={size}
              className={fill === 'empty' ? 'text-mist' : 'text-berry'}
              fill="none"
              aria-hidden="true"
            />
            {fill !== 'empty' && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: fill === 'half' ? '50%' : '100%' }}
                aria-hidden="true"
              >
                <Heart size={size} className="text-berry" fill="var(--color-berry)" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
