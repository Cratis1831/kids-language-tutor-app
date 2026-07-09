import { describe, expect, it } from 'vitest';
import { categoryList } from './categories';
import { allQuestions } from './questions';
import {
  buildLevels,
  candidateQuestionsForLevel,
  drawQuestionsForLevel,
} from './levels';

const PLAYER_ONE = 'explorer-1';
const PLAYER_TWO = 'explorer-2';

describe('shared level curriculum', () => {
  it('builds 100 levels from the complete question set', () => {
    expect(allQuestions).toHaveLength(500);
    expect(buildLevels()).toHaveLength(100);
  });

  it('uses easy questions for levels 1-50 and hard questions for 51-100', () => {
    for (const levelId of [1, 10, 50]) {
      expect(drawQuestionsForLevel(PLAYER_ONE, levelId).every((q) => q.difficulty === 'easy')).toBe(true);
    }
    for (const levelId of [51, 60, 100]) {
      expect(drawQuestionsForLevel(PLAYER_ONE, levelId).every((q) => q.difficulty === 'hard')).toBe(true);
    }
  });

  it('keeps matching player pools disjoint at every level', () => {
    for (let levelId = 1; levelId <= 100; levelId += 1) {
      for (const category of categoryList) {
        const first = new Set(
          candidateQuestionsForLevel(PLAYER_ONE, levelId, category.id).map((q) => q.id),
        );
        const second = candidateQuestionsForLevel(PLAYER_TWO, levelId, category.id);
        expect(second.every((q) => !first.has(q.id))).toBe(true);
      }
    }
  });

  it('gives both players access to all 500 questions across the map', () => {
    for (const profileId of [PLAYER_ONE, PLAYER_TWO]) {
      const available = new Set<string>();
      for (let levelId = 1; levelId <= 100; levelId += 1) {
        for (const category of categoryList) {
          for (const question of candidateQuestionsForLevel(profileId, levelId, category.id)) {
            available.add(question.id);
          }
        }
      }
      expect(available.size).toBe(500);
    }
  });

  it('draws one question per category and avoids the previous attempt', () => {
    const first = drawQuestionsForLevel(PLAYER_ONE, 25);
    const second = drawQuestionsForLevel(PLAYER_ONE, 25, first.map((q) => q.id));

    expect(new Set(first.map((q) => q.category)).size).toBe(categoryList.length);
    expect(new Set(second.map((q) => q.category)).size).toBe(categoryList.length);
    expect(second.every((q) => !first.some((previous) => previous.id === q.id))).toBe(true);
  });
});
