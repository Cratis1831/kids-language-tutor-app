import { useNavigate } from 'react-router-dom';
import { profiles } from '../../state/profiles';
import { loadProgress } from '../../state/progress';
import { buildLevelsForDifficulty } from '../../data/levels';
import { ui } from '../../i18n/ui';
import { StarPawn } from '../ui/StarPawn';
import { Stars } from '../ui/Stars';

export function PlayerSelect() {
  const navigate = useNavigate();

  return (
    <main className="min-h-full flex flex-col items-center justify-center px-5 py-10">
      <header className="mb-10 w-full max-w-xl text-center">
        <h1 className="text-balance font-display text-4xl font-bold leading-tight text-grape sm:text-6xl">
          {ui.appTitle}
        </h1>
        <p className="mt-2 font-display text-xl text-ink/70">{ui.appTagline}</p>
      </header>

      <h2 className="font-display text-2xl text-ink mb-6">{ui.choosePlayer}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {profiles.map((profile) => {
          const progress = loadProgress(profile.id);
          const totalLevels = buildLevelsForDifficulty(profile.difficulty).length;
          const completed = Object.keys(progress.stars).length;
          const totalStars = Object.values(progress.stars).reduce((a, b) => a + b, 0);
          return (
            <button
              key={profile.id}
              onClick={() => navigate(`/play/${profile.id}`)}
              className="group bg-white rounded-[var(--radius-blob)] p-7 text-center
                         shadow-[var(--shadow-pop)] transition-transform duration-150
                         hover:-translate-y-1 active:translate-y-0"
            >
              <div
                className="mx-auto mb-4 w-28 h-28 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${profile.color}22` }}
              >
                <StarPawn size={84} color={profile.color} />
              </div>
              <div className="font-display font-bold text-2xl text-ink">{profile.name}</div>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-ink/60">
                <Stars count={totalStars > 0 ? Math.min(3, Math.ceil(totalStars / totalLevels)) : 0} size={18} />
              </div>
              <div className="mt-3 text-sm text-ink/60">
                {completed} / {totalLevels} {ui.level.toLowerCase()}
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}
