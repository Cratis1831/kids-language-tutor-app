import type { Difficulty, Question } from '../../types';
import { mathQuestions } from './math';
import { mathExtraQuestions } from './math-extra';
import { scienceQuestions } from './science';
import { scienceExtraQuestions } from './science-extra';
import { coloursQuestions } from './colours';
import { coloursExtraQuestions } from './colours-extra';
import { shapesQuestions } from './shapes';
import { shapesExtraQuestions } from './shapes-extra';
import { measurementsQuestions } from './measurements';
import { measurementsExtraQuestions } from './measurements-extra';

// All questions across every category. Add a category by importing its file
// and spreading it here — the rest of the app reads this list generically.
export const allQuestions: Question[] = [
  ...mathQuestions,
  ...mathExtraQuestions,
  ...scienceQuestions,
  ...scienceExtraQuestions,
  ...coloursQuestions,
  ...coloursExtraQuestions,
  ...shapesQuestions,
  ...shapesExtraQuestions,
  ...measurementsQuestions,
  ...measurementsExtraQuestions,
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
