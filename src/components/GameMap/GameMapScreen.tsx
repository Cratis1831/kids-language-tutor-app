import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProfile } from '../../state/profiles';
import { loadProgress, resetProfileProgress } from '../../state/progress';
import { reconcileAttempt } from '../../state/attempt';
import { buildLevels } from '../../data/levels';
import { useLocale } from '../../i18n/LocaleContext';
import { sfx } from '../../audio/audio';
import { LangToggle } from '../ui/LangToggle';
import { SoundToggles } from '../ui/SoundToggles';
import { LivesDisplay } from '../ui/LivesDisplay';
import { GameMap } from './GameMap';
import { GameRulesPanel } from './GameRulesPanel';
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
  const { ui, uiLocale } = useLocale();
  const profile = getProfile(profileId);

  const levels = useMemo(
    () => (profile ? buildLevels() : []),
    [profile],
  );

  // Reconcile a dangling attempt (e.g. the browser was closed mid-level) before
  // reading progress, so lives reflect any abandon penalty.
  const [reconcile] = useState(() => reconcileAttempt(profileId));
  const [progress, setProgress] = useState(() => loadProgress(profileId));

  const locState = location.state as MapLocationState | null;

  // Two-tap confirm so a stray tap can't wipe a child's whole adventure.
  const [resetArmed, setResetArmed] = useState(false);
  const [rulesMinimized, setRulesMinimized] = useState(false);
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
    <main className="mx-auto min-h-full max-w-6xl px-4 pb-16">
      <header className="sticky top-0 z-30 -mx-4 mb-4 bg-cream/90 px-4 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 lg:flex-nowrap">
          <button
            onClick={() => navigate('/')}
            aria-label={ui.changePlayer}
            title={ui.changePlayer}
            className="flex h-11 shrink-0 items-center gap-1 rounded-xl px-1 font-display font-semibold text-grape sm:px-2"
          >
            <ChevronLeft size={22} aria-hidden="true" />
            <span className="hidden xl:inline">{ui.changePlayer}</span>
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
            <h1 className="hidden whitespace-nowrap font-display text-xl font-bold text-grape sm:block">
              {ui.appTitle}
            </h1>
            <span className="hidden h-5 w-px bg-mist/60 sm:block" aria-hidden="true" />
            <span
              className="h-6 w-6 shrink-0 rounded-full border-2 border-white"
              style={{ backgroundColor: profile.color }}
              aria-hidden="true"
            />
            <span className="truncate font-display font-bold text-ink">{profile.name}</span>
          </div>

          <div className="shrink-0" title={ui.lives}>
            <LivesDisplay lives={progress.lives} size={20} />
          </div>

          <nav
            className="order-last flex w-full items-center justify-center gap-2 border-t-2 border-cream-deep pt-2 lg:order-none lg:w-auto lg:border-0 lg:pt-0"
            aria-label={ui.appTitle}
          >
            <button
              type="button"
              onClick={() => navigate('/leaderboard')}
              aria-label={ui.leaderboard}
              title={ui.leaderboard}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-sunshine text-ink shadow-(--shadow-nub) active:translate-y-0.5 active:shadow-none"
            >
              <Trophy size={20} aria-hidden="true" />
            </button>
            <LangToggle compact />
            <SoundToggles />
            <button
              type="button"
              onClick={handleReset}
              aria-label={resetArmed ? ui.tapToConfirm : ui.resetProgress}
              title={resetArmed ? ui.tapToConfirm : ui.resetProgress}
              className={[
                'flex h-11 w-11 items-center justify-center rounded-full shadow-(--shadow-nub)',
                'transition-colors active:translate-y-0.5 active:shadow-none',
                resetArmed ? 'bg-berry text-white' : 'bg-white text-ink/55',
              ].join(' ')}
            >
              <RotateCcw size={19} aria-hidden="true" />
            </button>
          </nav>
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

      <div
        className={[
          'lg:grid lg:gap-10',
          rulesMinimized
            ? 'lg:grid-cols-[3.5rem_minmax(0,1fr)]'
            : 'lg:grid-cols-[18rem_minmax(0,1fr)]',
        ].join(' ')}
      >
        <GameRulesPanel
          ui={ui}
          locale={uiLocale}
          minimized={rulesMinimized}
          onToggleMinimized={() => setRulesMinimized((value) => !value)}
        />
        <div className="min-w-0">
          <GameMap
            levels={levels}
            progress={progress}
            pawnLevel={pawnLevel}
            pawnColor={profile.color}
            pawnCharacterId={profile.characterId}
            levelLabel={ui.level}
            lockedLabel={ui.locked}
            completedLabel={ui.completedLabel}
            onSelect={(levelId) => navigate(`/play/${profileId}/level/${levelId}`)}
          />

          {levels.length === 0 && (
            <p className="mt-6 text-center text-berry">Aucune question disponible.</p>
          )}
        </div>
      </div>
    </main>
  );
}
