import type { CategoryId, Difficulty, Level, Question } from '../types';
import { categoryList } from './categories';
import { questionsByDifficulty } from './questions';

export const QUESTIONS_PER_LEVEL = 5;

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
      questionIds: chunk.map((q) => q.id),
    });
  }
  return levels;
}
