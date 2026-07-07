import { useMemo, type CSSProperties } from 'react';

const COLORS = ['#6c4ab6', '#ff5d8f', '#2ec4b6', '#ffc93c', '#4f97ff'];

interface Piece {
  dx: number;
  dy: number;
  rot: number;
  delay: number;
  duration: number;
  color: string;
  shape: number; // 0 = rectangle, 1 = circle, 2 = triangle
  size: number;
}

/**
 * A one-shot confetti explosion from the centre of the screen, used to
 * celebrate a perfect level. Pure CSS-animated coloured shapes (no emojis);
 * the global reduced-motion rule collapses it for users who opt out.
 */
export function ConfettiBurst({ count = 80 }: { count?: number }) {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 130 + Math.random() * 380;
        return {
          dx: Math.cos(angle) * distance,
          // Bias downward so the burst falls like real confetti.
          dy: Math.sin(angle) * distance * 0.85 + 190,
          rot: Math.random() * 900 - 450,
          delay: Math.random() * 0.2,
          duration: 1.1 + Math.random() * 1.0,
          color: COLORS[i % COLORS.length],
          shape: i % 3,
          size: 9 + Math.random() * 9,
        };
      }),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={
            {
              position: 'absolute',
              left: '50%',
              top: '38%',
              width: p.size,
              height: p.shape === 1 ? p.size : p.size * 0.62,
              backgroundColor: p.color,
              borderRadius: p.shape === 1 ? '50%' : 2,
              clipPath: p.shape === 2 ? 'polygon(50% 0, 100% 100%, 0 100%)' : undefined,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--rot': `${p.rot}deg`,
              animation: `confetti-burst ${p.duration}s cubic-bezier(0.16, 0.6, 0.4, 1) ${p.delay}s both`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
