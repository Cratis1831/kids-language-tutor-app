import type { Difficulty, Question } from '../../types';
import { mathQuestions } from './math';
import { scienceQuestions } from './science';
import { coloursQuestions } from './colours';
import { shapesQuestions } from './shapes';
import { measurementsQuestions } from './measurements';

// All questions across every category. Add a category by importing its file
// and spreading it here — the rest of the app reads this list generically.
export const allQuestions: Question[] = [
  ...mathQuestions,
  ...scienceQuestions,
  ...coloursQuestions,
  ...shapesQuestions,
  ...measurementsQuestions,
];

export const questionsById: Map<string, Question> = new Map(
  allQuestions.map((q) => [q.id, q]),
);

export function getQuestion(id: string): Question | undefined {
  return questionsById.get(id);
}

export function questionsByDifficulty(difficulty: Difficulty): Question[] {
  return allQuestions.filter((q) => q.difficulty === difficulty);
}
