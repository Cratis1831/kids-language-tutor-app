import type { CategoryId, Difficulty, Question } from '../../types';
import { trueFalseOptions } from './_helpers';
import { frNumber, enNumber } from './_numbers';

// Compact builders for authoring questions in one or two lines. The correct
// answer is always written first; the quiz shuffles options at play time, so
// authoring order carries no bias.

/** A localized option: [french, english]. */
export type Opt = [fr: string, en: string];

const OPTION_IDS = ['a', 'b', 'c', 'd'];

/** An option whose label is a number word in both languages. */
export const num = (n: number): Opt => [frNumber(n), enNumber(n)];

/** An option shown as digits (for large numbers like 120). */
export const digits = (n: number): Opt => [String(n), String(n)];

export function questionFactory(category: CategoryId, startAt = 21) {
  let n = startAt - 1;
  const nextId = () => {
    n += 1;
    return `${category}-${String(n).padStart(2, '0')}`;
  };

  const mc = (
    difficulty: Difficulty,
    fr: string,
    en: string,
    correct: Opt,
    wrong: Opt[],
    timerSeconds?: number,
  ): Question => ({
    id: nextId(),
    category,
    difficulty,
    type: 'multiple-choice',
    prompt: { fr, en },
    options: [correct, ...wrong].map(([f, e], i) => ({
      id: OPTION_IDS[i],
      label: { fr: f, en: e },
    })),
    correctOptionId: 'a',
    timerSeconds: timerSeconds ?? (difficulty === 'easy' ? 20 : 24),
  });

  const tf = (
    difficulty: Difficulty,
    fr: string,
    en: string,
    answer: boolean,
    timerSeconds?: number,
  ): Question => ({
    id: nextId(),
    category,
    difficulty,
    type: 'true-false',
    prompt: { fr, en },
    options: trueFalseOptions,
    correctOptionId: answer ? 'true' : 'false',
    timerSeconds: timerSeconds ?? (difficulty === 'easy' ? 18 : 22),
  });

  return { mc, tf };
}
