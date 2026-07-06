import { Lock, Star } from 'lucide-react';
import type { Level, Progress } from '../../types';
import { buildMapLayout } from './mapLayout';
import { StarPawn } from '../ui/StarPawn';

interface GameMapProps {
  levels: Level[];
  progress: Progress;
  /** Which node the player token sits on (lets the map animate a "hop"). */
  pawnLevel: number;
  pawnColor: string;
  onSelect: (levelId: number) => void;
  levelLabel: string;
  lockedLabel: string;
}

export function GameMap({
  levels,
  progress,
  pawnLevel,
  pawnColor,
  onSelect,
  levelLabel,
  lockedLabel,
}: GameMapProps) {
  const layout = buildMapLayout(levels.length);
  const pawnNode = layout.nodes[Math.min(pawnLevel, levels.length) - 1];

  return (
    <div className="relative mx-auto w-full max-w-md" style={{ height: layout.height }}>
      {/* Winding road */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 100 ${layout.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={layout.pathD}
          fill="none"
          stroke="var(--color-cream-deep)"
          strokeWidth={22}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={layout.pathD}
          fill="none"
          stroke="var(--color-mist)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="1 14"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Level nodes */}
      {levels.map((level) => {
        const node = layout.nodes[level.id - 1];
        const unlocked = level.id <= progress.unlockedLevel;
        const stars = progress.stars[level.id];
        const completed = stars !== undefined;
        return (
          <button
            key={level.id}
            disabled={!unlocked}
            onClick={() => onSelect(level.id)}
            aria-label={
              unlocked ? `${levelLabel} ${level.id}` : `${levelLabel} ${level.id} — ${lockedLabel}`
            }
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform
                       duration-150 enabled:hover:scale-110 disabled:cursor-not-allowed"
            style={{ left: `${node.x}%`, top: node.y }}
          >
            <span
              className={[
                'flex h-[68px] w-[68px] items-center justify-center rounded-full border-4',
                'font-display text-2xl font-bold',
                unlocked
                  ? 'border-white text-cream shadow-[0_6px_0_rgba(43,33,64,0.18)]'
                  : 'border-white/70 bg-mist/50 text-white',
              ].join(' ')}
              style={unlocked ? { backgroundColor: completed ? 'var(--color-lagoon)' : 'var(--color-grape)' } : undefined}
            >
              {unlocked ? level.id : <Lock size={26} aria-hidden="true" />}
            </span>
            {completed && (
              <span className="absolute left-1/2 -bottom-3 flex -translate-x-1/2 gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    strokeWidth={2}
                    className={i < stars ? 'text-sunshine' : 'text-mist'}
                    fill={i < stars ? 'var(--color-sunshine)' : 'var(--color-cream)'}
                  />
                ))}
              </span>
            )}
          </button>
        );
      })}

      {/* Player token — animates to the furthest unlocked node */}
      {pawnNode && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${pawnNode.x}%`, top: pawnNode.y - 58 }}
        >
          <StarPawn size={52} color={pawnColor} />
        </div>
      )}
    </div>
  );
}
