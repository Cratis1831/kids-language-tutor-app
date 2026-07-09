import type { CategoryId, Level, LevelTier, Question } from '../types';
import { QUESTION_BAND_SIZE, tierForLevel } from '../config/gameRules';
import { shuffleArray } from '../utils/shuffle';
import { categoryList } from './categories';
import { questionsByDifficulty } from './questions';

export const QUESTIONS_PER_LEVEL = 5;

/** How much of the normal question timer each tier gets. */
export const TIER_TIME_FACTOR: Record<LevelTier, number> = {
  easy: 1,
  medium: 0.75,
  hard: 0.55,
};

function questionsByCategory(): Map<CategoryId, Question[]> {
  const byCategory = new Map<CategoryId, Question[]>();
  for (const cat of categoryList) byCategory.set(cat.id, []);

  // Every player follows the same curriculum: all authored easy questions,
  // then all authored hard questions. Each category currently has 50 of each.
  for (const difficulty of ['easy', 'hard'] as const) {
    for (const question of questionsByDifficulty(difficulty)) {
      byCategory.get(question.category)?.push(question);
    }
  }
  return byCategory;
}

const sharedQuestions = questionsByCategory();

/** Build the shared 100-level path from the smallest complete category pool. */
export function buildLevels(): Level[] {
  const totalLevels = Math.min(
    ...categoryList.map((category) => sharedQuestions.get(category.id)?.length ?? 0),
  );
  return Array.from({ length: totalLevels }, (_, index) => ({
    id: index + 1,
    tier: tierForLevel(index + 1),
  }));
}

function playerSlot(profileId: string): 0 | 1 {
  if (profileId === 'explorer-1') return 0;
  if (profileId === 'explorer-2') return 1;
  let hash = 0;
  for (const char of profileId) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return (Math.abs(hash) % 2) as 0 | 1;
}

/**
 * Return this player's protected candidates for a category and level. Rotating
 * a ten-question band before splitting it gives both players access to every
 * question across the band, while the two matching level pools stay disjoint.
 */
export function candidateQuestionsForLevel(
  profileId: string,
  levelId: number,
  categoryId: CategoryId,
): Question[] {
  const list = sharedQuestions.get(categoryId) ?? [];
  if (list.length === 0) return [];

  const bandIndex = Math.floor((levelId - 1) / QUESTION_BAND_SIZE);
  const band = list.slice(
    bandIndex * QUESTION_BAND_SIZE,
    (bandIndex + 1) * QUESTION_BAND_SIZE,
  );
  if (band.length < 2) return band.length > 0 ? band : list;

  const rotation = (levelId - 1) % band.length;
  const rotated = [...band.slice(rotation), ...band.slice(0, rotation)];
  const split = Math.ceil(rotated.length / 2);
  return playerSlot(profileId) === 0
    ? rotated.slice(0, split)
    : rotated.slice(split);
}

/**
 * Draw a fresh set of questions for one attempt at a level: one random question
 * per category, taken from the level's protected player pool. Bands 1–5 use
 * easy questions and bands 6–10 use hard questions. Pass the previous attempt's
 * question ids as `avoidIds` to steer clear of an immediate repeat.
 */
export function drawQuestionsForLevel(
  profileId: string,
  levelId: number,
  avoidIds: string[] = [],
): Question[] {
  const avoid = new Set(avoidIds);

  const picked: Question[] = [];
  for (const cat of categoryList) {
    const candidatePool = candidateQuestionsForLevel(profileId, levelId, cat.id);
    if (candidatePool.length === 0) continue;
    const fresh = candidatePool.filter((q) => !avoid.has(q.id));
    const candidates = fresh.length > 0 ? fresh : candidatePool;
    picked.push(candidates[Math.floor(Math.random() * candidates.length)]);
  }

  // Shuffle so category order also varies between attempts.
  return shuffleArray(picked);
}
