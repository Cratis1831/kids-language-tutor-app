import type { Progress } from '../types';

// Local persistence. This module is the single boundary to storage, so a real
// database can later replace the localStorage calls behind the same functions.

const STORAGE_PREFIX = 'fla:progress:';

function keyFor(profileId: string): string {
  return `${STORAGE_PREFIX}${profileId}`;
}

function emptyProgress(): Progress {
  return { unlockedLevel: 1, stars: {}, points: {} };
}

export function loadProgress(profileId: string): Progress {
  try {
    const raw = localStorage.getItem(keyFor(profileId));
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      unlockedLevel: Math.max(1, parsed.unlockedLevel ?? 1),
      stars: parsed.stars ?? {},
      points: parsed.points ?? {}, // older saves predate points
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(profileId: string, progress: Progress): void {
  try {
    localStorage.setItem(keyFor(profileId), JSON.stringify(progress));
  } catch {
    // Storage unavailable (private mode / disabled) — progress just won't persist.
  }
}

/** Sum of a player's best points across all levels. */
export function totalPoints(progress: Progress): number {
  return Object.values(progress.points).reduce((a, b) => a + b, 0);
}

/** Sum of a player's stars across all levels. */
export function totalStars(progress: Progress): number {
  return Object.values(progress.stars).reduce((a, b) => a + b, 0);
}

/**
 * Reset the leaderboard: wipe every player's stars and points but keep their
 * unlocked levels, so nobody loses their place on the map.
 */
export function resetAllScores(profileIds: string[]): void {
  for (const id of profileIds) {
    const progress = loadProgress(id);
    saveProgress(id, { ...progress, stars: {}, points: {} });
  }
}

/**
 * Record a finished level. Keeps the best star count and best points for that
 * level and unlocks the next one. Returns the updated progress.
 */
export function recordLevelResult(
  profileId: string,
  levelId: number,
  stars: number,
  points: number,
  totalLevels: number,
): Progress {
  const progress = loadProgress(profileId);
  const bestStars = Math.max(progress.stars[levelId] ?? 0, stars);
  const bestPoints = Math.max(progress.points[levelId] ?? 0, points);
  const nextUnlocked = Math.min(
    Math.max(progress.unlockedLevel, levelId + 1),
    totalLevels,
  );
  const updated: Progress = {
    unlockedLevel: nextUnlocked,
    stars: { ...progress.stars, [levelId]: bestStars },
    points: { ...progress.points, [levelId]: bestPoints },
  };
  saveProgress(profileId, updated);
  return updated;
}
