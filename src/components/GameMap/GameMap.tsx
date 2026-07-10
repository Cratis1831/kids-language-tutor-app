import { useEffect, useMemo, useRef, useState } from 'react';
import { Lock, Star } from 'lucide-react';
import type { CharacterId, Level, Progress } from '../../types';
import { sfx } from '../../audio/audio';
import { buildMapLayout } from './mapLayout';
import { MapScenery } from './MapScenery';
import { TierFlag } from './TierFlag';
import { StarPawn } from '../ui/StarPawn';

interface GameMapProps {
  levels: Level[];
  progress: Progress;
  /** Which node the player token sits on (lets the map animate a "hop"). */
  pawnLevel: number;
  pawnColor: string;
  pawnCharacterId: CharacterId;
  onSelect: (levelId: number) => void;
  levelLabel: string;
  lockedLabel: string;
  completedLabel: string;
}

export function GameMap({
  levels,
  progress,
  pawnLevel,
  pawnColor,
  pawnCharacterId,
  onSelect,
  levelLabel,
  lockedLabel,
  completedLabel,
}: GameMapProps) {
  const layout = useMemo(() => buildMapLayout(levels.length), [levels.length]);
  const pawnNode = layout.nodes[Math.min(pawnLevel, levels.length) - 1];

  // Play a little arc-hop (and boing) whenever the token moves to a new node.
  const [hopping, setHopping] = useState(false);
  const prevPawnLevel = useRef(pawnLevel);
  useEffect(() => {
    if (prevPawnLevel.current !== pawnLevel) {
      prevPawnLevel.current = pawnLevel;
      setHopping(true);
      sfx.hop();
      const timer = setTimeout(() => setHopping(false), 900);
      return () => clearTimeout(timer);
    }
  }, [pawnLevel]);

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

      {/* Scenery beside the road, behind the level nodes */}
      <MapScenery nodes={layout.nodes} />

      {/* Level nodes */}
      {levels.map((level) => {
        const node = layout.nodes[level.id - 1];
        const unlocked = level.id <= progress.unlockedLevel;
        // Completion derives from the frontier, not from stars — so a
        // leaderboard score wipe can't make beaten levels playable again.
        const completed = level.id < progress.unlockedLevel;
        const playable = unlocked && !completed;
        const stars = progress.stars[level.id];
        const hasStars = stars !== undefined;
        return (
          <button
            key={level.id}
            disabled={!playable}
            onClick={() => onSelect(level.id)}
            aria-label={
              completed
                ? `${levelLabel} ${level.id} — ${completedLabel}`
                : unlocked
                  ? `${levelLabel} ${level.id}`
                  : `${levelLabel} ${level.id} — ${lockedLabel}`
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
              {level.id}
            </span>
            {/* Small padlock badge so locked levels still read as locked. */}
            {!unlocked && (
              <span className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-mist text-white">
                <Lock size={12} aria-hidden="true" />
              </span>
            )}
            {/* Difficulty pennant */}
            <span className="absolute -right-4 -top-5">
              <TierFlag tier={level.tier} size={20} />
            </span>
            {hasStars && (
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

      {/* Player token — slides to the furthest unlocked node with an arc hop,
          idles with a gentle bounce, and does a somersault every few seconds */}
      {pawnNode && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${pawnNode.x}%`, top: pawnNode.y - 58 }}
        >
          <div className={hopping ? 'pawn-hop' : 'pawn-idle'}>
            <div className="pawn-somersault">
              <StarPawn size={52} color={pawnColor} characterId={pawnCharacterId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
