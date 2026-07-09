import type { CategoryId, Difficulty, Level, LevelTier, Question } from '../types';
import { QUESTION_BAND_SIZE } from '../config/gameRules';
import { shuffleArray } from '../utils/shuffle';
import { categoryList } from './categories';
import { questionsByDifficulty } from './questions';

export const QUESTIONS_PER_LEVEL = 5;

/** Levels ending in 5 are medium, ending in 0 are hard, the rest are easy. */
export function tierFor(levelId: number): LevelTier {
  if (levelId % 10 === 0) return 'hard';
  if (levelId % 5 === 0) return 'medium';
  return 'easy';
}

/** How much of the normal question timer each tier gets. */
export const TIER_TIME_FACTOR: Record<LevelTier, number> = {
  easy: 1,
  medium: 0.75,
  hard: 0.55,
};

/**
 * Build the ordered list of levels for a difficulty. Questions are interleaved
 * round-robin across categories so each level mixes topics, then chunked into
 * levels of QUESTIONS_PER_LEVEL. Difficulty rises naturally: later levels pull
 * the later (harder) questions authored within each category.
 */
export function buildLevelsForDifficulty(difficulty: Difficulty): Level[] {
  const pool = questionsByDifficulty(difficulty);

  const byCategory = new Map<CategoryId, Question[]>();
  for (const cat of categoryList) byCategory.set(cat.id, []);
  for (const q of pool) byCategory.get(q.category)?.push(q);

  // Round-robin interleave across categories for a varied path.
  const ordered: Question[] = [];
  let added = true;
  let index = 0;
  while (added) {
    added = false;
    for (const cat of categoryList) {
      const list = byCategory.get(cat.id)!;
      if (index < list.length) {
        ordered.push(list[index]);
        added = true;
      }
    }
    index += 1;
  }

  const levels: Level[] = [];
  for (let i = 0; i < ordered.length; i += QUESTIONS_PER_LEVEL) {
    const chunk = ordered.slice(i, i + QUESTIONS_PER_LEVEL);
    if (chunk.length === 0) continue;
    levels.push({
      id: levels.length + 1,
      tier: tierFor(levels.length + 1),
      questionIds: chunk.map((q) => q.id),
    });
  }
  return levels;
}

/**
 * Draw a fresh set of questions for one attempt at a level: one random question
 * per category, taken from the level's difficulty band. Bands group levels in
 * tens, so levels 1–10 draw from each category's first 10 authored questions,
 * 11–20 from the next 10, etc. — the same rising difficulty as the fixed level
 * layout, but varied on each attempt. Pass the previous attempt's question ids
 * as `avoidIds` to steer clear of an immediate repeat.
 */
export function drawQuestionsForLevel(
  difficulty: Difficulty,
  levelId: number,
  avoidIds: string[] = [],
): Question[] {
  const pool = questionsByDifficulty(difficulty);

  const byCategory = new Map<CategoryId, Question[]>();
  for (const cat of categoryList) byCategory.set(cat.id, []);
  for (const q of pool) byCategory.get(q.category)?.push(q);

  const band = Math.floor((levelId - 1) / QUESTION_BAND_SIZE);
  const avoid = new Set(avoidIds);

  const picked: Question[] = [];
  for (const cat of categoryList) {
    const list = byCategory.get(cat.id)!;
    if (list.length === 0) continue;
    // The band's slice for this category, falling back to the whole list.
    const slice = list.slice(band * QUESTION_BAND_SIZE, (band + 1) * QUESTION_BAND_SIZE);
    const candidatePool = slice.length > 0 ? slice : list;
    // Prefer candidates not in the just-played set; if that leaves nothing
    // (a pool of one), allow the repeat rather than picking nothing.
    const fresh = candidatePool.filter((q) => !avoid.has(q.id));
    const candidates = fresh.length > 0 ? fresh : candidatePool;
    picked.push(candidates[Math.floor(Math.random() * candidates.length)]);
  }

  // Shuffle so category order also varies between attempts.
  return shuffleArray(picked);
}
