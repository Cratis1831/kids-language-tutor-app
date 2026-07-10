import type { CharacterId, Profile } from '../types';

// Player profiles, persisted to localStorage so kids can set their own names.
// A future settings screen / database can replace this behind the same functions.

const STORAGE_KEY = 'fla:profiles';

export const CHARACTER_IDS: CharacterId[] = [
  'classic', 'sprout', 'crown', 'wizard', 'pirate',
  'astronaut', 'artist', 'scholar', 'butterfly', 'superstar',
];

export const CHARACTER_COLORS = [
  { value: '#2ec4b6', name: 'Lagoon' },
  { value: '#ff5d8f', name: 'Berry' },
  { value: '#6c4ab6', name: 'Grape' },
  { value: '#3478c9', name: 'Ocean' },
  { value: '#ef7b45', name: 'Tangerine' },
  { value: '#e5a800', name: 'Sunshine' },
  { value: '#55a630', name: 'Leaf' },
  { value: '#d14d9f', name: 'Dragon fruit' },
] as const;

const defaultProfiles: Profile[] = [
  { id: 'explorer-1', name: 'Explorateur', color: '#2ec4b6', characterId: 'classic' },
  { id: 'explorer-2', name: 'Exploratrice', color: '#ff5d8f', characterId: 'butterfly' },
];

function isCharacterId(value: unknown): value is CharacterId {
  return typeof value === 'string' && CHARACTER_IDS.includes(value as CharacterId);
}

function normalizeProfile(value: Partial<Profile>, index: number): Profile | null {
  if (typeof value.id !== 'string' || typeof value.name !== 'string' || typeof value.color !== 'string') return null;
  return {
    id: value.id,
    name: value.name,
    color: value.color,
    characterId: isCharacterId(value.characterId) ? value.characterId : CHARACTER_IDS[index % CHARACTER_IDS.length],
  };
}

export function loadProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfiles;
    const parsed = JSON.parse(raw) as Partial<Profile>[];
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultProfiles;
    const profiles = parsed.map(normalizeProfile).filter((profile): profile is Profile => profile !== null);
    if (profiles.length === 0) return defaultProfiles;
    if (profiles.some((profile, index) => profile.characterId !== parsed[index]?.characterId)) saveProfiles(profiles);
    return profiles;
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

export function updateProfileAppearance(id: string, characterId: CharacterId, color: string): Profile[] {
  const profiles = loadProfiles().map((profile) =>
    profile.id === id ? { ...profile, characterId, color } : profile,
  );
  saveProfiles(profiles);
  return profiles;
}

export function getProfile(id: string): Profile | undefined {
  return loadProfiles().find((p) => p.id === id);
}
