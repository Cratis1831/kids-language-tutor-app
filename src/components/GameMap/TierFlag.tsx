import type { LevelTier } from '../../types';

export const TIER_COLORS: Record<LevelTier, string> = {
  easy: '#3fb96f', // green
  medium: '#ffa62b', // orangey yellow
  hard: '#ff5757', // red
};

/** A little pennant flag showing how hard a level is. */
export function TierFlag({ tier, size = 24 }: { tier: LevelTier; size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 26 30" aria-hidden="true">
      <line x1="4" y1="3" x2="4" y2="27" stroke="#8c6239" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M6 3 L24 8.5 L6 14 Z" fill={TIER_COLORS[tier]} stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
