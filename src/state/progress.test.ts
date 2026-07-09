import { beforeEach, describe, expect, it } from 'vitest';
import { loadProgress, recordLevelResult, saveProgress } from './progress';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe('progress scoring', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    });
  });

  it('migrates legacy scores to fixed tier values', () => {
    localStorage.setItem('fla:progress:legacy', JSON.stringify({
      unlockedLevel: 11,
      stars: { 1: 2, 5: 3, 10: 1 },
      points: { 1: 30, 5: 75, 10: 40 },
      lives: 2.5,
    }));

    const progress = loadProgress('legacy');
    expect(progress.points).toEqual({ 1: 50, 5: 75, 10: 125 });
    expect(progress.unlockedLevel).toBe(11);
    expect(progress.lives).toBe(2.5);
    expect(JSON.parse(localStorage.getItem('fla:progress:legacy') ?? '{}').version).toBe(2);
  });

  it('records the fixed reward for each level tier', () => {
    saveProgress('player', { unlockedLevel: 1, stars: {}, points: {}, lives: 3 });
    expect(recordLevelResult('player', 1, 2, 100).progress.points[1]).toBe(50);

    saveProgress('player', { unlockedLevel: 5, stars: {}, points: {}, lives: 3 });
    expect(recordLevelResult('player', 5, 2, 100).progress.points[5]).toBe(75);

    saveProgress('player', { unlockedLevel: 10, stars: {}, points: {}, lives: 3 });
    expect(recordLevelResult('player', 10, 2, 100).progress.points[10]).toBe(125);
  });
});
