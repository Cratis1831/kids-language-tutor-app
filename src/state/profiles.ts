import type { Profile } from '../types';

// Player profiles, persisted to localStorage so kids can set their own names.
// A future settings screen / database can replace this behind the same functions.

const STORAGE_KEY = 'fla:profiles';

const defaultProfiles: Profile[] = [
  { id: 'explorer-1', name: 'Explorateur', color: '#2ec4b6' },
  { id: 'explorer-2', name: 'Exploratrice', color: '#ff5d8f' },
];

export function loadProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfiles;
    const parsed = JSON.parse(raw) as Profile[];
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultProfiles;
    return parsed;
  } catch {
    return defaultProfiles;
  }
}

export function saveProfiles(profiles: Profile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    // storage unavailable — names just won't persist
  }
}

/** Rename a player. Empty names are ignored. Returns the updated list. */
export function renameProfile(id: string, name: string): Profile[] {
  const trimmed = name.trim();
  const profiles = loadProfiles().map((p) =>
    p.id === id && trimmed ? { ...p, name: trimmed } : p,
  );
  saveProfiles(profiles);
  return profiles;
}

export function getProfile(id: string): Profile | undefined {
  return loadProfiles().find((p) => p.id === id);
}
