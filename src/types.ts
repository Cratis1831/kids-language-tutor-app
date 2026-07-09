// Core domain types. Language is data-driven — never hardcode a specific
// language in the UI; read text through the active locale instead.

export type Locale = 'fr' | 'en'; // add more locales here later
export type LocalizedText = Partial<Record<Locale, string>>;

export type CategoryId = 'math' | 'science' | 'colours' | 'shapes' | 'measurements';
export type Difficulty = 'easy' | 'hard';
export type QuestionType = 'multiple-choice' | 'true-false';

export interface AnswerOption {
  id: string;
  label: LocalizedText;
}

export interface Question {
  id: string;
  category: CategoryId;
  difficulty: Difficulty;
  type: QuestionType;
  /** The question text in each supported language. */
  prompt: LocalizedText;
  /** Multiple-choice: 2–4 options. True/false: two options (Vrai / Faux). */
  options: AnswerOption[];
  correctOptionId: string;
  /** Countdown length for this question, in seconds. */
  timerSeconds: number;
}

export interface Category {
  id: CategoryId;
  name: LocalizedText;
  /** Theme colour token value used on the map / badges. */
  color: string;
}

/**
 * How challenging a level is, derived from its number: levels ending in 5 are
 * medium, levels ending in 0 are hard, everything else is easy. Harder tiers
 * shorten the question timers.
 */
export type LevelTier = 'easy' | 'medium' | 'hard';

export interface Level {
  /** 1-based level number, also its position along the map path. */
  id: number;
  tier: LevelTier;
}

export interface Profile {
  id: string;
  name: string;
  /** A palette token value used to colour this player's avatar. */
  color: string;
}

/** Per-level result: number of stars earned (0–3). */
export type LevelStars = Record<number, number>;

export interface Progress {
  /** Highest level the player has unlocked (1 .. totalLevels + 1). */
  unlockedLevel: number;
  /** Stars earned per completed level. */
  stars: LevelStars;
  /** Best points earned per completed level. */
  points: Record<number, number>;
  /** Remaining lives, in 0.5 steps, within (0, LIVES_MAX]. */
  lives: number;
}
