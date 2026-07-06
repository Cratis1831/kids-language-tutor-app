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
  and a difficulty (`easy` / `hard`) so questions suit their level.
- **Map** — one winding path of levels; each level is 5 questions mixed across
  categories. Finishing a level earns up to 3 stars and unlocks the next one.
- **Questions** — multiple-choice or true/false. A speaker icon reads the French
  aloud (browser text-to-speech); a lightbulb icon reveals the English hint; a
  ring times each question.
- **Saving** — progress is stored in the browser's `localStorage` (no backend
  yet). All storage goes through `src/state/progress.ts`, so a real database can
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
