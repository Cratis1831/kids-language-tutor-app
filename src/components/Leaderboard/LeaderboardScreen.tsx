import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RotateCcw, Star, Trophy } from 'lucide-react';
import { useLocale } from '../../i18n/LocaleContext';
import { loadProfiles } from '../../state/profiles';
import { loadProgress, resetAllScores, totalPoints, totalStars } from '../../state/progress';
import { sfx } from '../../audio/audio';
import { StarPawn } from '../ui/StarPawn';

const MEDAL_COLORS = ['#ffc93c', '#c3c9dd', '#d29a6b'];

interface Entry {
  profile: ReturnType<typeof loadProfiles>[number];
  points: number;
  stars: number;
  levelsDone: number;
}

function computeEntries(): Entry[] {
  return loadProfiles()
    .map((profile) => {
      const progress = loadProgress(profile.id);
      return {
        profile,
        points: totalPoints(progress),
        stars: totalStars(progress),
        levelsDone: Object.keys(progress.stars).length,
      };
    })
    .sort((a, b) => b.points - a.points);
}

export function LeaderboardScreen() {
  const navigate = useNavigate();
  const { ui } = useLocale();
  const [entries, setEntries] = useState<Entry[]>(computeEntries);
  // Two-tap confirm so a stray tap can't wipe the scores.
  const [resetArmed, setResetArmed] = useState(false);
  const [justReset, setJustReset] = useState(false);

  useEffect(() => {
    if (!resetArmed) return;
    const timer = setTimeout(() => setResetArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [resetArmed]);

  const handleReset = () => {
    sfx.click();
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    resetAllScores(loadProfiles().map((p) => p.id));
    setEntries(computeEntries());
    setResetArmed(false);
    setJustReset(true);
    setTimeout(() => setJustReset(false), 3000);
  };

  const nobodyPlayed = entries.every((e) => e.points === 0);

  return (
    <main className="mx-auto min-h-full max-w-xl px-4 pb-16">
      <header className="flex items-center gap-2 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 rounded-xl px-2 py-1 font-display font-semibold text-grape"
        >
          <ChevronLeft size={22} aria-hidden="true" />
          {ui.changePlayer}
        </button>
      </header>

      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-sunshine/25">
          <Trophy size={44} className="text-sunshine" strokeWidth={2.2} aria-hidden="true" />
        </div>
        <h1 className="font-display text-3xl font-bold text-grape sm:text-4xl">{ui.leaderboard}</h1>
        {(nobodyPlayed || justReset) && (
          <p className="mt-2 font-display text-lg text-ink/60">
            {justReset ? ui.scoresReset : ui.playToEarn}
          </p>
        )}
      </div>

      <ol className="flex flex-col gap-4">
        {entries.map((entry, i) => (
          <li
            key={entry.profile.id}
            className="flex items-center gap-4 rounded-(--radius-blob) bg-white p-5 shadow-(--shadow-pop)"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4
                         border-white font-display text-xl font-bold text-ink shadow-(--shadow-nub)"
              style={{ backgroundColor: MEDAL_COLORS[i] ?? 'var(--color-cream-deep)' }}
            >
              {i + 1}
            </span>
            <div className="shrink-0">
              <StarPawn size={52} color={entry.profile.color} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-xl font-bold text-ink">
                {entry.profile.name}
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-sm font-semibold text-ink/60">
                <span className="inline-flex items-center gap-1">
                  <Star size={16} className="text-sunshine" fill="var(--color-sunshine)" aria-hidden="true" />
                  {entry.stars}
                </span>
                <span>
                  {entry.levelsDone} {entry.levelsDone === 1 ? ui.levelDone : ui.levelsDone}
                </span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-display text-3xl font-bold text-grape">{entry.points}</div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                {ui.points}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={handleReset}
          className={[
            'inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 font-display font-semibold',
            'transition-colors active:translate-y-0.5',
            resetArmed
              ? 'bg-berry text-white shadow-[0_5px_0_#d93a6d]'
              : 'bg-white text-ink/60 shadow-(--shadow-nub)',
          ].join(' ')}
        >
          <RotateCcw size={18} aria-hidden="true" />
          {resetArmed ? ui.tapToConfirm : ui.resetScores}
        </button>
      </div>
    </main>
  );
}
