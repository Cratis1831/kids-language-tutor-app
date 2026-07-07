# French Learning Adventure

A colourful, kid-friendly web game that helps children learn French through a
Candyland-style level map. Questions are asked in French with French answers,
an English hint on demand, a per-question timer, and spoken audio. Built for two
young players at different levels.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

Other scripts:

- `npm run build` — type-check and build a production bundle into `dist/`.
- `npm run preview` — serve the production build locally.

## How it works

- **Players** — a pick-a-player screen. Each child has their own saved progress
  and a difficulty (`easy` / `hard`) so questions suit their level. Tap the
  pencil on a card to set a player's name.
- **Map** — one winding path of 50 levels through SVG scenery (trees, flowers,
  mushrooms, clouds); each level is 5 questions mixed across categories.
  Finishing a level earns up to 3 stars and unlocks the next one. Each node
  carries a difficulty pennant: levels ending in 5 are medium (orange flag),
  levels ending in 0 are hard (red flag), the rest are easy (green flag) —
  harder tiers shorten the question timers.
- **Questions** — 500 in the pool (100 per category), multiple-choice or
  true/false, with answer order shuffled every playthrough. A speaker icon
  reads the French aloud (browser text-to-speech); a lightbulb icon reveals
  the English hint; a ring times each question.
- **Audio** — generated sound effects (clicks, right/wrong, fanfares) and a
  soft looping Frère Jacques melody, with separate music and sound toggles.
  The map character bounces, somersaults, and hops forward after each level.
- **Points & leaderboard** — every correct answer earns 10 points, a perfect
  level adds a 25-point bonus (and a confetti explosion). The leaderboard ranks
  players by their best points per level, and a two-tap reset button clears
  scores without losing anyone's place on the map.
- **English menus** — a toggle on the player select and map screens switches the
  app chrome to English. Question content stays in the learning language.
- **Saving** — progress, points, names, and the language choice are stored in
  the browser's `localStorage` (no backend yet). All storage goes through
  `src/state/progress.ts` and `src/state/profiles.ts`, so a real database can
  replace it later behind the same functions.

## Adding content

- **More questions** — add entries to the files in `src/data/questions/`
  (`math.ts`, `science.ts`, `colours.ts`, `shapes.ts`, `measurements.ts`). Each
  question has `fr` and `en` text; the app reads them generically.
- **A new category** — create a file in `src/data/questions/`, register it in
  `src/data/categories.ts` and spread it into `src/data/questions/index.ts`.
- **Another language** — add the locale to `Locale` in `src/types.ts`, add the
  matching keys to each question's `prompt`/`options` and to `src/i18n/ui/`, then
  point `contentLocale` / `hintLocale` in `src/i18n/config.ts` at it. Nothing is
  hardcoded to French.
- **Players** — edit `src/state/profiles.ts` (names, colours, difficulty).

## Tech

Vite + React + TypeScript, Tailwind CSS v4, React Router, lucide-react icons
(all iconography is SVG — no emojis), self-hosted Fredoka + Nunito fonts.
