interface TimerProps {
  remaining: number;
  /** 0 → 1 fraction of time elapsed. */
  fraction: number;
}

const SIZE = 60;
const STROKE = 7;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

/** A circular countdown ring that turns from lagoon to berry as time runs low. */
export function Timer({ remaining, fraction }: TimerProps) {
  const clamped = Math.min(1, Math.max(0, fraction));
  const low = remaining <= 5;
  const color = low ? 'var(--color-berry)' : 'var(--color-lagoon)';
  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }} aria-label={`${remaining}s`}>
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="var(--color-cream-deep)" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * clamped}
          style={{ transition: 'stroke-dashoffset 0.15s linear, stroke 0.3s' }}
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center font-display text-xl font-bold ${
          low ? 'text-berry' : 'text-ink'
        }`}
      >
        {remaining}
      </span>
    </div>
  );
}
