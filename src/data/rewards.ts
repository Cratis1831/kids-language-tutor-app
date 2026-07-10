import type { Progress } from '../types';

export const REWARD_STEP_POINTS = 1_000;

/**
 * Append-only reward order. Never reorder or replace an id: a milestone always
 * resolves to the same item, even after the catalog grows.
 */
export const REWARD_CATALOG = [
  'trail-cape',
  'baseball-cap',
  'sun-glasses',
  'scout-scarf',
  'adventure-satchel',
  'rain-boots',
] as const;

export type RewardItemId = (typeof REWARD_CATALOG)[number];

export function earnedRewardItems(progress: Pick<Progress, 'lifetimePoints'>): RewardItemId[] {
  const count = Math.min(
    REWARD_CATALOG.length,
    Math.floor(Math.max(0, progress.lifetimePoints) / REWARD_STEP_POINTS),
  );
  return REWARD_CATALOG.slice(0, count);
}
