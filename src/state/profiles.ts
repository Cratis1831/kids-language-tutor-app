import type { Profile } from '../types';

// The two players. Editable here for now; a future settings screen / database
// can replace this default list.
export const profiles: Profile[] = [
  { id: 'explorer-1', name: 'Explorateur', color: '#2ec4b6', difficulty: 'easy' },
  { id: 'explorer-2', name: 'Exploratrice', color: '#ff5d8f', difficulty: 'hard' },
];

export function getProfile(id: string): Profile | undefined {
  return profiles.find((p) => p.id === id);
}
