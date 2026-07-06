interface StarPawnProps {
  size?: number;
  color?: string;
}

/**
 * The player's map token: a rounded star-shaped explorer with a friendly face.
 * Pure SVG so there are no emojis anywhere in the app.
 */
export function StarPawn({ size = 56, color = 'var(--color-berry)' }: StarPawnProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Your explorer"
    >
      <defs>
        <filter id="pawn-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#2b2140" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Chunky rounded star body */}
      <path
        d="M50 8
           C56 8 60 16 64 26
           C74 27 84 29 86 35
           C88 41 82 48 76 55
           C79 65 81 74 76 78
           C71 82 62 79 52 76
           C42 79 33 82 28 78
           C23 74 25 65 28 55
           C22 48 16 41 18 35
           C20 29 30 27 40 26
           C44 16 44 8 50 8 Z"
        fill={color}
        stroke="#2b2140"
        strokeWidth="4"
        strokeLinejoin="round"
        filter="url(#pawn-shadow)"
      />
      {/* Eyes */}
      <circle cx="42" cy="46" r="5" fill="#2b2140" />
      <circle cx="58" cy="46" r="5" fill="#2b2140" />
      <circle cx="43.5" cy="44.5" r="1.6" fill="#fff" />
      <circle cx="59.5" cy="44.5" r="1.6" fill="#fff" />
      {/* Smile */}
      <path
        d="M40 58 Q50 68 60 58"
        fill="none"
        stroke="#2b2140"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Cheeks */}
      <circle cx="35" cy="55" r="3.5" fill="#fff" opacity="0.5" />
      <circle cx="65" cy="55" r="3.5" fill="#fff" opacity="0.5" />
    </svg>
  );
}
