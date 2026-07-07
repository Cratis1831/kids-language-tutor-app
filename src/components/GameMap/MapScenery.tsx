import { useMemo } from 'react';
import type { MapNode } from './mapLayout';

// Storybook scenery drawn as plain SVG (no emojis): trees, pines, flowers,
// bushes, mushrooms and clouds scattered beside the winding road.

interface SpriteProps {
  size: number;
}

function Tree({ size }: SpriteProps) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 64 80">
      <rect x="28" y="46" width="8" height="28" rx="4" fill="#a0764b" />
      <circle cx="32" cy="28" r="20" fill="#4cb782" />
      <circle cx="17" cy="38" r="12" fill="#5fcd94" />
      <circle cx="47" cy="38" r="12" fill="#3da26e" />
      <circle cx="26" cy="22" r="4" fill="#ffffff" opacity="0.25" />
    </svg>
  );
}

function Pine({ size }: SpriteProps) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 64 90">
      <rect x="28" y="64" width="8" height="20" rx="4" fill="#8c6239" />
      <polygon points="32,4 50,34 14,34" fill="#2f9d6a" />
      <polygon points="32,22 54,54 10,54" fill="#37b078" />
      <polygon points="32,42 58,72 6,72" fill="#43c286" />
    </svg>
  );
}

function Flower({ size }: SpriteProps) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 48 64">
      <path d="M24 30 Q22 48 24 60" stroke="#4cb782" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M24 44 Q14 42 10 36" stroke="#4cb782" strokeWidth="4" fill="none" strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <circle
          key={deg}
          cx={24 + 9 * Math.cos((deg * Math.PI) / 180)}
          cy={18 + 9 * Math.sin((deg * Math.PI) / 180)}
          r="7"
          fill="#ff5d8f"
        />
      ))}
      <circle cx="24" cy="18" r="6" fill="#ffc93c" />
    </svg>
  );
}

function Bush({ size }: SpriteProps) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 64 44">
      <circle cx="18" cy="30" r="14" fill="#43c286" />
      <circle cx="44" cy="30" r="14" fill="#37b078" />
      <circle cx="31" cy="20" r="14" fill="#5fcd94" />
      <circle cx="24" cy="30" r="2.5" fill="#ff5d8f" />
      <circle cx="40" cy="24" r="2.5" fill="#ff5d8f" />
    </svg>
  );
}

function Mushroom({ size }: SpriteProps) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 48 52">
      <rect x="18" y="26" width="12" height="20" rx="6" fill="#fff3df" />
      <path d="M4 26 Q24 -8 44 26 Z" fill="#ff5d8f" />
      <circle cx="16" cy="17" r="3.5" fill="#ffffff" />
      <circle cx="30" cy="12" r="3" fill="#ffffff" />
      <circle cx="36" cy="20" r="2.5" fill="#ffffff" />
    </svg>
  );
}

function Cloud({ size }: SpriteProps) {
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 80 44">
      <ellipse cx="26" cy="30" rx="22" ry="13" fill="#ffffff" opacity="0.9" />
      <ellipse cx="52" cy="28" rx="20" ry="12" fill="#ffffff" opacity="0.9" />
      <ellipse cx="40" cy="18" rx="16" ry="12" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

const SPRITES = [Tree, Pine, Flower, Bush, Mushroom];

interface SceneryItem {
  x: number;
  y: number;
  size: number;
  flip: boolean;
  Sprite: (props: SpriteProps) => ReturnType<typeof Tree>;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Deterministically scatter scenery beside the road: for each segment between
 * two level nodes, plant something on the outer side of the curve (plus a
 * smaller companion every other segment) so the layout is stable across renders.
 */
export function MapScenery({ nodes }: { nodes: MapNode[] }) {
  const items = useMemo<SceneryItem[]>(() => {
    const out: SceneryItem[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i];
      const b = nodes[i + 1];
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const side = midX >= 50 ? -1 : 1; // plant on the roomier side

      out.push({
        x: clamp(midX + side * (28 + ((i * 13) % 9)), 8, 92),
        y: midY + (((i * 29) % 21) - 10),
        size: 42 + (i % 3) * 10,
        flip: i % 2 === 0,
        Sprite: SPRITES[(i * 2 + 1) % SPRITES.length],
      });

      if (i % 2 === 0) {
        out.push({
          x: clamp(midX - side * (34 + ((i * 7) % 8)), 6, 94),
          y: midY + 26,
          size: 30 + ((i * 5) % 12),
          flip: i % 3 === 0,
          Sprite: SPRITES[(i * 3 + 4) % SPRITES.length],
        });
      }
    }
    return out;
  }, [nodes]);

  const clouds = useMemo(() => {
    if (nodes.length < 2) return [];
    return [
      { x: 15, y: nodes[0].y - 55, size: 64 },
      { x: 84, y: nodes[Math.min(2, nodes.length - 1)].y - 40, size: 52 },
      { x: 12, y: nodes[Math.min(5, nodes.length - 1)].y - 30, size: 58 },
      { x: 86, y: nodes[Math.min(8, nodes.length - 1)].y - 45, size: 48 },
    ].slice(0, Math.max(2, Math.floor(nodes.length / 3)));
  }, [nodes]);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {clouds.map((c, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${c.x}%`, top: c.y }}
        >
          <Cloud size={c.size} />
        </div>
      ))}
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${item.x}%`,
            top: item.y,
            transform: `translate(-50%, -50%) scaleX(${item.flip ? -1 : 1})`,
          }}
        >
          <item.Sprite size={item.size} />
        </div>
      ))}
    </div>
  );
}
