import type { Progress } from '../types';
import {
  BONUS_LIFE_AMOUNT,
  BONUS_LIFE_EVERY_LEVELS,
  LIVES_MAX,
  LIVES_START,
  pointsForLevel,
} from '../config/gameRules';
import { clearAttempt } from './attempt';

// Local persistence. This module is the single boundary to storage, so a real
// database can later replace the localStorage calls behind the same functions.

const STORAGE_PREFIX = 'fla:progress:';
const STORAGE_VERSION = 3;

interface StoredProgress extends Progress {
  version: typeof STORAGE_VERSION;
}

function keyFor(profileId: string): string {
  return `${STORAGE_PREFIX}${profileId}`;
}

function emptyProgress(): Progress {
  return { unlockedLevel: 1, stars: {}, points: {}, lifetimePoints: 0, lives: LIVES_START };
}

/** Clamp lives into [0.5, LIVES_MAX], rounded to the nearest half. */
function clampLives(value: number): number {
  const rounded = Math.round(value * 2) / 2;
  return Math.min(LIVES_MAX, Math.max(0.5, rounded));
}

export function loadProgress(profileId: string): Progress {
  try {
    const raw = localStorage.getItem(keyFor(profileId));
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    // Older saves predate lives — default them to a full starting stock.
    const lives = Number.isFinite(parsed.lives)
      ? clampLives(parsed.lives as number)
      : LIVES_START;
    const legacyPoints = parsed.points ?? {};
    const points = parsed.version === STORAGE_VERSION
      ? legacyPoints
      : Object.fromEntries(
          Object.keys(legacyPoints)
            .map(Number)
            .filter((levelId) => Number.isInteger(levelId) && levelId > 0)
            .map((levelId) => [levelId, pointsForLevel(levelId)]),
        );
    const progress: Progress = {
      unlockedLevel: Math.max(1, parsed.unlockedLevel ?? 1),
      stars: parsed.stars ?? {},
      points,
      // Version 2 introduced normalized scores. Seed the lifetime counter once
      // from those scores; version 1 saves use the normalized migration above.
      lifetimePoints: parsed.version === STORAGE_VERSION && Number.isFinite(parsed.lifetimePoints)
        ? Math.max(0, parsed.lifetimePoints as number)
        : Object.values(points).reduce((sum, value) => sum + value, 0),
      lives,
    };
    if (parsed.version !== STORAGE_VERSION) saveProgress(profileId, progress);
    return progress;
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(profileId: string, progress: Progress): void {
  try {
    const stored: StoredProgress = { version: STORAGE_VERSION, ...progress };
    localStorage.setItem(keyFor(profileId), JSON.stringify(stored));
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
 * unlocked levels and lives, so nobody loses their place on the map.
 */
export function resetAllScores(profileIds: string[]): void {
  for (const id of profileIds) {
    const progress = loadProgress(id);
    saveProgress(id, { ...progress, stars: {}, points: {} });
  }
}

/**
 * Wipe a single profile's progress back to the very start — levels, scores, and
 * lives. This is the only way to replay beaten levels, and also what happens
 * when a player runs out of lives. Clears any dangling attempt marker so a
 * freshly reset profile can't be penalized for an old, abandoned attempt.
 */
export function resetProfileProgress(profileId: string): Progress {
  const lifetimePoints = loadProgress(profileId).lifetimePoints;
  const fresh = { ...emptyProgress(), lifetimePoints };
  saveProgress(profileId, fresh);
  clearAttempt(profileId);
  return fresh;
}

/**
 * Deduct lives. If they hit zero (or below), the whole profile resets and the
 * caller is told it's game over. The reset is written atomically here, so a
 * refresh right after losing the last life can never observe a 0-lives state.
 */
export function loseLife(
  profileId: string,
  amount: number,
): { progress: Progress; gameOver: boolean } {
  const progress = loadProgress(profileId);
  const lives = progress.lives - amount;
  if (lives <= 0) {
    return { progress: resetProfileProgress(profileId), gameOver: true };
  }
  const updated: Progress = { ...progress, lives };
  saveProgress(profileId, updated);
  return { progress: updated, gameOver: false };
}

/**
 * Record a passed level. Keeps the best star count, assigns the level's fixed
 * tier reward, and unlocks the next one (up to totalLevels + 1, meaning "all done").
 * Grants a bonus life on every BONUS_LIFE_EVERY_LEVELS-th newly passed level.
 * Returns the updated progress and whether a bonus life was awarded.
 */
export function recordLevelResult(
  profileId: string,
  levelId: number,
  stars: number,
  totalLevels: number,
): { progress: Progress; bonusLifeAwarded: boolean } {
  const progress = loadProgress(profileId);
  const bestStars = Math.max(progress.stars[levelId] ?? 0, stars);
  const bestPoints = pointsForLevel(levelId);
  const nextUnlocked = Math.min(
    Math.max(progress.unlockedLevel, levelId + 1),
    totalLevels + 1,
  );

  // A "new" pass is one at or beyond the current frontier; only new passes can
  // cross a bonus milestone (levels pass strictly in order once beaten levels
  // become unplayable, so passedCount is exactly the number cleared).
  const isNewPass = levelId >= progress.unlockedLevel;
  const passedCount = nextUnlocked - 1;
  const bonusLifeAwarded =
    isNewPass && passedCount % BONUS_LIFE_EVERY_LEVELS === 0;
  const lives = bonusLifeAwarded
    ? Math.min(LIVES_MAX, progress.lives + BONUS_LIFE_AMOUNT)
    : progress.lives;

  const updated: Progress = {
    unlockedLevel: nextUnlocked,
    stars: { ...progress.stars, [levelId]: bestStars },
    points: { ...progress.points, [levelId]: bestPoints },
    lifetimePoints: progress.lifetimePoints + (progress.points[levelId] === undefined ? bestPoints : 0),
    lives,
  };
  saveProgress(profileId, updated);
  return { progress: updated, bonusLifeAwarded };
}
