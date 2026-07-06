import type { Progress } from '../types';

// Local persistence. This module is the single boundary to storage, so a real
// database can later replace the localStorage calls behind the same functions.

const STORAGE_PREFIX = 'fla:progress:';

function keyFor(profileId: string): string {
  return `${STORAGE_PREFIX}${profileId}`;
}

function emptyProgress(): Progress {
  return { unlockedLevel: 1, stars: {} };
}

export function loadProgress(profileId: string): Progress {
  try {
    const raw = localStorage.getItem(keyFor(profileId));
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      unlockedLevel: Math.max(1, parsed.unlockedLevel ?? 1),
      stars: parsed.stars ?? {},
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

/**
 * Record a finished level. Keeps the best star count for that level and unlocks
 * the next level. Returns the updated progress.
 */
export function recordLevelResult(
  profileId: string,
  levelId: number,
  stars: number,
  totalLevels: number,
): Progress {
  const progress = loadProgress(profileId);
  const bestStars = Math.max(progress.stars[levelId] ?? 0, stars);
  const nextUnlocked = Math.min(
    Math.max(progress.unlockedLevel, levelId + 1),
    totalLevels,
  );
  const updated: Progress = {
    unlockedLevel: nextUnlocked,
    stars: { ...progress.stars, [levelId]: bestStars },
  };
  saveProgress(profileId, updated);
  return updated;
}
