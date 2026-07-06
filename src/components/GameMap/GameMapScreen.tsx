import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProfile } from '../../state/profiles';
import { loadProgress } from '../../state/progress';
import { buildLevelsForDifficulty } from '../../data/levels';
import { categories } from '../../data/categories';
import { getQuestion } from '../../data/questions';
import { t } from '../../i18n/config';
import { ui } from '../../i18n/ui';
import { contentLocale } from '../../i18n/config';
import { Button } from '../ui/Button';
import { GameMap } from './GameMap';
import { ChevronLeft } from 'lucide-react';

interface MapLocationState {
  justCompleted?: number;
}

export function GameMapScreen() {
  const { profileId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const profile = getProfile(profileId);

  const levels = useMemo(
    () => (profile ? buildLevelsForDifficulty(profile.difficulty) : []),
    [profile],
  );
  const progress = loadProgress(profileId);

  // Animate the token hopping forward when returning from a finished level.
  const justCompleted = (location.state as MapLocationState | null)?.justCompleted;
  const [pawnLevel, setPawnLevel] = useState(
    justCompleted && justCompleted < progress.unlockedLevel ? justCompleted : progress.unlockedLevel,
  );
  useEffect(() => {
    if (justCompleted && justCompleted < progress.unlockedLevel) {
      const id = requestAnimationFrame(() => setPawnLevel(progress.unlockedLevel));
      return () => cancelAnimationFrame(id);
    }
  }, [justCompleted, progress.unlockedLevel]);

  if (!profile) {
    navigate('/', { replace: true });
    return null;
  }

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
      </header>

      <GameMap
        levels={levels}
        progress={progress}
        pawnLevel={pawnLevel}
        pawnColor={profile.color}
        levelLabel={ui.level}
        lockedLabel={ui.locked}
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

      {/* Preload check: guard against an empty pool so the map never renders blank. */}
      {levels.length > 0 && getQuestion(levels[0].questionIds[0]) === undefined && (
        <p className="mt-6 text-center text-berry">Aucune question disponible.</p>
      )}

      <div className="mt-8 text-center">
        <Button variant="soft" onClick={() => navigate('/')}>
          {ui.changePlayer}
        </Button>
      </div>
    </main>
  );
}
