import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProfile } from '../../state/profiles';
import { loadProgress, resetProfileProgress } from '../../state/progress';
import { reconcileAttempt } from '../../state/attempt';
import { buildLevelsForDifficulty } from '../../data/levels';
import { categories } from '../../data/categories';
import { getQuestion } from '../../data/questions';
import { contentLocale, t } from '../../i18n/config';
import { useLocale } from '../../i18n/LocaleContext';
import { sfx } from '../../audio/audio';
import { Button } from '../ui/Button';
import { LangToggle } from '../ui/LangToggle';
import { SoundToggles } from '../ui/SoundToggles';
import { LivesDisplay } from '../ui/LivesDisplay';
import { GameMap } from './GameMap';
import { TierFlag } from './TierFlag';
import { ChevronLeft, RotateCcw, Trophy } from 'lucide-react';

interface MapLocationState {
  justCompleted?: number;
  gameOver?: boolean;
  lifeLost?: boolean;
}

type Notice = 'gameOver' | 'lifeLost' | 'progressReset';

export function GameMapScreen() {
  const { profileId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { ui } = useLocale();
  const profile = getProfile(profileId);

  const levels = useMemo(
    () => (profile ? buildLevelsForDifficulty(profile.difficulty) : []),
    [profile],
  );

  // Reconcile a dangling attempt (e.g. the browser was closed mid-level) before
  // reading progress, so lives reflect any abandon penalty.
  const [reconcile] = useState(() => reconcileAttempt(profileId));
  const [progress, setProgress] = useState(() => loadProgress(profileId));

  const locState = location.state as MapLocationState | null;

  // Two-tap confirm so a stray tap can't wipe a child's whole adventure.
  const [resetArmed, setResetArmed] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(() => {
    if (reconcile.gameOver || locState?.gameOver) return 'gameOver';
    if (reconcile.penalized || locState?.lifeLost) return 'lifeLost';
    return null;
  });

  useEffect(() => {
    if (!resetArmed) return;
    const timer = setTimeout(() => setResetArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [resetArmed]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  // Animate the token hopping forward when returning from a finished level.
  const justCompleted = locState?.justCompleted;
  const [pawnLevel, setPawnLevel] = useState(
    justCompleted && justCompleted < progress.unlockedLevel ? justCompleted : progress.unlockedLevel,
  );
  useEffect(() => {
    if (justCompleted && justCompleted < progress.unlockedLevel) {
      const id = requestAnimationFrame(() => setPawnLevel(progress.unlockedLevel));
      return () => cancelAnimationFrame(id);
    }
  }, [justCompleted, progress.unlockedLevel]);

  const handleReset = () => {
    sfx.click();
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    const fresh = resetProfileProgress(profileId);
    setProgress(fresh);
    setPawnLevel(1);
    setResetArmed(false);
    setNotice('progressReset');
  };

  if (!profile) {
    navigate('/', { replace: true });
    return null;
  }

  const noticeText =
    notice === 'gameOver'
      ? ui.gameOverMessage
      : notice === 'lifeLost'
        ? ui.lifeLostAbandon
        : notice === 'progressReset'
          ? ui.progressReset
          : '';

  return (
    <main className="mx-auto min-h-full max-w-2xl px-4 pb-16">
      <header className="sticky top-0 z-20 -mx-4 mb-2 bg-cream/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => navigate('/')}
            className="flex shrink-0 items-center gap-1 rounded-xl px-1 py-1 font-display font-semibold text-grape"
          >
            <ChevronLeft size={22} aria-hidden="true" />
            <span className="hidden sm:inline">{ui.changePlayer}</span>
          </button>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className="h-6 w-6 shrink-0 rounded-full border-2 border-white"
              style={{ backgroundColor: profile.color }}
              aria-hidden="true"
            />
            <span className="whitespace-nowrap font-display font-bold text-ink">{profile.name}</span>
          </div>
        </div>
        <h1 className="mt-1 text-center font-display text-2xl font-bold text-grape">
          {ui.appTitle}
        </h1>
        <div className="mt-1 flex items-center justify-center">
          <LivesDisplay lives={progress.lives} size={22} />
        </div>
      </header>

      {notice && (
        <div
          className={[
            'mb-3 rounded-2xl px-4 py-2 text-center font-display font-semibold',
            notice === 'progressReset'
              ? 'bg-lagoon/15 text-lagoon'
              : 'bg-berry/15 text-berry',
          ].join(' ')}
          role="status"
        >
          {noticeText}
        </div>
      )}

      <GameMap
        levels={levels}
        progress={progress}
        pawnLevel={pawnLevel}
        pawnColor={profile.color}
        levelLabel={ui.level}
        lockedLabel={ui.locked}
        completedLabel={ui.completedLabel}
        onSelect={(levelId) => navigate(`/play/${profileId}/level/${levelId}`)}
      />

      {/* Little legend of the categories in this adventure — no emojis, just dots. */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {Object.values(categories).map((cat) => (
          <span key={cat.id} className="flex items-center gap-2 text-sm font-semibold text-ink/70">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
            {t(cat.name, contentLocale)}
          </span>
        ))}
      </div>

      {/* Difficulty flag legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {(
          [
            ['easy', ui.tierEasy],
            ['medium', ui.tierMedium],
            ['hard', ui.tierHard],
          ] as const
        ).map(([tier, label]) => (
          <span key={tier} className="flex items-center gap-1.5 text-sm font-semibold text-ink/70">
            <TierFlag tier={tier} size={16} />
            {label}
          </span>
        ))}
      </div>

      {/* Preload check: guard against an empty pool so the map never renders blank. */}
      {levels.length > 0 && getQuestion(levels[0].questionIds[0]) === undefined && (
        <p className="mt-6 text-center text-berry">Aucune question disponible.</p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="soft" onClick={() => navigate('/')}>
          {ui.changePlayer}
        </Button>
        <Button variant="sun" onClick={() => navigate('/leaderboard')}>
          <span className="inline-flex items-center gap-2">
            <Trophy size={20} aria-hidden="true" />
            {ui.leaderboard}
          </span>
        </Button>
        <LangToggle />
        <SoundToggles />
      </div>

      <div className="mt-6 text-center">
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
          {resetArmed ? ui.tapToConfirm : ui.resetProgress}
        </button>
      </div>
    </main>
  );
}
