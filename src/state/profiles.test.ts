import { beforeEach, describe, expect, it } from 'vitest';
import { loadProfiles, updateProfileAppearance } from './profiles';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe('profile appearance', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    });
  });

  it('adds a character to legacy profiles without changing their color', () => {
    localStorage.setItem('fla:profiles', JSON.stringify([
      { id: 'legacy', name: 'Léo', color: '#123456' },
    ]));

    expect(loadProfiles()[0]).toEqual({
      id: 'legacy', name: 'Léo', color: '#123456', characterId: 'classic',
    });
    expect(JSON.parse(localStorage.getItem('fla:profiles') ?? '[]')[0].characterId).toBe('classic');
  });

  it('persists character and color together', () => {
    const profile = loadProfiles()[0];
    updateProfileAppearance(profile.id, 'astronaut', '#3478c9');

    expect(loadProfiles()[0]).toMatchObject({ characterId: 'astronaut', color: '#3478c9' });
  });
});
