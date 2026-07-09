import { LIFE_LOST_ON_ABANDON } from '../config/gameRules';
import { loseLife } from './progress';

// Tracks an in-progress level attempt so leaving mid-level (back button, tab
// close, refresh) can be detected and penalized on the next load. Per-profile
// key means an attempt can never leak across profiles.

const KEY_PREFIX = 'fla:attempt:';

function keyFor(profileId: string): string {
  return `${KEY_PREFIX}${profileId}`;
}

export interface AttemptMarker {
  levelId: number;
  answeredCount: number;
  questionIds: string[];
  startedAt: number;
}

function read(profileId: string): AttemptMarker | null {
  try {
    const raw = localStorage.getItem(keyFor(profileId));
    if (!raw) return null;
    return JSON.parse(raw) as AttemptMarker;
  } catch {
    return null;
  }
}

/** Start (or overwrite) the marker for a fresh attempt. Idempotent. */
export function beginAttempt(
  profileId: string,
  levelId: number,
  questionIds: string[],
): void {
  try {
    const marker: AttemptMarker = {
      levelId,
      answeredCount: 0,
      questionIds,
      startedAt: Date.now(),
    };
    localStorage.setItem(keyFor(profileId), JSON.stringify(marker));
  } catch {
    // Storage unavailable — anti-cheat just won't survive a refresh.
  }
}

/** Update how many questions have been answered so far in the current attempt. */
export function markAnswered(profileId: string, answeredCount: number): void {
  const marker = read(profileId);
  if (!marker) return;
  try {
    localStorage.setItem(
      keyFor(profileId),
      JSON.stringify({ ...marker, answeredCount }),
    );
  } catch {
    // Ignore — the marker just keeps its previous count.
  }
}

/** Remove the marker (attempt finished cleanly or was intentionally cleared). */
export function clearAttempt(profileId: string): void {
  try {
    localStorage.removeItem(keyFor(profileId));
  } catch {
    // Ignore.
  }
}

/**
 * Reconcile a dangling attempt left by a refresh, tab close, or stray
 * navigation. Read-and-clear: the marker is removed first, then the abandon
 * penalty is applied only if at least one question was answered. Returns what
 * happened plus the abandoned question ids (so the next draw can avoid an
 * immediate repeat). Safe under React StrictMode double-invocation — the second
 * call finds no marker and no-ops.
 */
export function reconcileAttempt(profileId: string): {
  penalized: boolean;
  gameOver: boolean;
  lastQuestionIds: string[] | null;
} {
  const marker = read(profileId);
  if (!marker) {
    return { penalized: false, gameOver: false, lastQuestionIds: null };
  }
  clearAttempt(profileId);
  if (marker.answeredCount > 0) {
    const { gameOver } = loseLife(profileId, LIFE_LOST_ON_ABANDON);
    return { penalized: true, gameOver, lastQuestionIds: marker.questionIds };
  }
  return { penalized: false, gameOver: false, lastQuestionIds: marker.questionIds };
}
