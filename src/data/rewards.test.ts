import { describe, expect, it } from 'vitest';
import { earnedRewardItems, REWARD_CATALOG } from './rewards';

describe('reward progression', () => {
  it('awards one stable catalog item at each 1,000-point milestone', () => {
    expect(earnedRewardItems({ lifetimePoints: 999 })).toEqual([]);
    expect(earnedRewardItems({ lifetimePoints: 1_000 })).toEqual([REWARD_CATALOG[0]]);
    expect(earnedRewardItems({ lifetimePoints: 3_250 })).toEqual(REWARD_CATALOG.slice(0, 3));
    expect(earnedRewardItems({ lifetimePoints: 99_000 })).toEqual(REWARD_CATALOG);
  });
});
