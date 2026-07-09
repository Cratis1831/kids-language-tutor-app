// Central, tunable game rules. Change a value here to rebalance the game — no
// other module hardcodes these numbers.

/** Correct answers (of QUESTIONS_PER_LEVEL) needed to pass a level. */
export const PASS_THRESHOLD = 3;

/** Lives a player begins the adventure with. */
export const LIVES_START = 3;

/** Most lives a player can bank up (bonus lives are capped here). */
export const LIVES_MAX = 5;

/** Lives lost when a level is failed (score below PASS_THRESHOLD). */
export const LIFE_LOST_ON_FAIL = 1;

/** Lives lost when a level is abandoned after answering at least one question. */
export const LIFE_LOST_ON_ABANDON = 1;

/** Grant a bonus life every this many levels passed. */
export const BONUS_LIFE_EVERY_LEVELS = 5;

/** How much life a milestone grants (0.5 = half a heart). Exact in floats. */
export const BONUS_LIFE_AMOUNT = 0.5;

/**
 * Levels per difficulty band for drawing questions. Each attempt draws from the
 * band's pool so restarting a level serves different questions of similar
 * difficulty. With 10 authored questions per category per difficulty, a band of
 * 10 gives every level a fresh pool of 10 candidates per category.
 */
export const QUESTION_BAND_SIZE = 10;
