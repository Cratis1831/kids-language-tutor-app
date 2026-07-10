import { useId } from 'react';
import type { RewardItemId } from '../../data/rewards';
import type { CharacterId } from '../../types';

interface StarPawnProps {
  size?: number;
  color?: string;
  characterId?: CharacterId;
  label?: string;
  items?: readonly RewardItemId[];
}

/**
 * The player's map token: a rounded star-shaped explorer with a friendly face.
 * Pure SVG so there are no emojis anywhere in the app.
 */
export function StarPawn({ size = 56, color = 'var(--color-berry)', characterId = 'classic', label = 'Your explorer', items = [] }: StarPawnProps) {
  const filterId = `pawn-shadow-${useId().replace(/:/g, '')}`;
  const earned = new Set(items);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={label}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#2b2140" floodOpacity="0.25" />
        </filter>
      </defs>
      {earned.has('trail-cape') ? (
        <path d="M30 39 Q15 54 22 83 Q36 78 49 68 L45 38 Z" fill="#6c4ab6" stroke="#2b2140" strokeWidth="3.5" strokeLinejoin="round" />
      ) : null}
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
        filter={`url(#${filterId})`}
      />
      {characterId === 'sprout' && <><path d="M50 24 C43 12 47 5 52 4 C58 10 57 18 50 24Z" fill="#55a630" stroke="#2b2140" strokeWidth="3"/><path d="M50 20 C57 10 65 11 68 14 C64 22 57 25 50 20Z" fill="#7bc950" stroke="#2b2140" strokeWidth="3"/></>}
      {characterId === 'crown' && <path d="M35 28 L32 12 L43 19 L50 8 L57 19 L68 12 L65 29Z" fill="#ffc93c" stroke="#2b2140" strokeWidth="3" strokeLinejoin="round"/>}
      {characterId === 'wizard' && <><path d="M31 30 L50 3 L70 31Z" fill="#6c4ab6" stroke="#2b2140" strokeWidth="3" strokeLinejoin="round"/><circle cx="51" cy="13" r="3" fill="#ffc93c"/><path d="M28 30 Q50 24 72 30" fill="none" stroke="#ffc93c" strokeWidth="5" strokeLinecap="round"/></>}
      {characterId === 'pirate' && <><path d="M31 40 Q50 29 69 40" fill="#2b2140"/><path d="M34 38 Q50 27 66 38" fill="none" stroke="#fff" strokeWidth="3"/><rect x="53" y="40" width="14" height="12" rx="5" fill="#2b2140"/><path d="M52 45 H68" stroke="#2b2140" strokeWidth="3"/></>}
      {characterId === 'astronaut' && <><path d="M29 35 Q50 18 71 35 L67 57 Q50 68 33 57Z" fill="#dff7ff" fillOpacity=".82" stroke="#2b2140" strokeWidth="3"/><path d="M34 34 Q50 23 66 34" fill="none" stroke="#fff" strokeWidth="3" opacity=".9"/></>}
      {characterId === 'artist' && <><path d="M31 31 Q39 14 55 17 Q72 20 68 34 Q62 30 56 35 Q48 27 31 31Z" fill="#fff7ec" stroke="#2b2140" strokeWidth="3"/><circle cx="43" cy="23" r="2.5" fill="#ff5d8f"/><circle cx="51" cy="22" r="2.5" fill="#2ec4b6"/><circle cx="59" cy="25" r="2.5" fill="#ffc93c"/></>}
      {characterId === 'scholar' && <><path d="M28 31 L50 21 L72 31 L50 41Z" fill="#4f2f96" stroke="#2b2140" strokeWidth="3"/><path d="M68 32 V43" stroke="#ffc93c" strokeWidth="3" strokeLinecap="round"/><circle cx="68" cy="45" r="3" fill="#ffc93c"/></>}
      {characterId === 'butterfly' && <><path d="M26 48 C10 34 8 62 28 63" fill="#ffc93c" stroke="#2b2140" strokeWidth="3"/><path d="M74 48 C90 34 92 62 72 63" fill="#ffc93c" stroke="#2b2140" strokeWidth="3"/><circle cx="20" cy="52" r="3" fill="#ff5d8f"/><circle cx="80" cy="52" r="3" fill="#ff5d8f"/></>}
      {characterId === 'superstar' && <><path d="M29 42 Q37 34 45 42 L43 51 Q35 56 28 49Z" fill="#3478c9" stroke="#2b2140" strokeWidth="3"/><path d="M55 42 Q63 34 71 42 L72 49 Q65 56 57 51Z" fill="#3478c9" stroke="#2b2140" strokeWidth="3"/><path d="M44 44 H56" stroke="#2b2140" strokeWidth="3"/></>}
      {earned.has('adventure-satchel') ? (
        <g stroke="#2b2140" strokeWidth="3" strokeLinejoin="round"><path d="M34 34 Q63 50 69 69" fill="none" /><path d="M63 64 Q76 62 78 72 L76 84 Q66 86 60 79 Z" fill="#d29a6b" /><path d="M64 69 L76 70" /></g>
      ) : null}
      {earned.has('scout-scarf') ? (
        <g stroke="#2b2140" strokeWidth="3" strokeLinejoin="round"><path d="M31 62 Q50 72 69 62 L65 72 Q50 80 35 72 Z" fill="#ff5d8f" /><path d="M52 71 L61 88 L50 83 L44 90 L44 72 Z" fill="#ff5d8f" /></g>
      ) : null}
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
      {earned.has('sun-glasses') ? (
        <g fill="#263b59" stroke="#2b2140" strokeWidth="2.5"><path d="M33 41 H48 L47 51 Q40 57 35 51 Z" /><path d="M52 41 H67 L65 51 Q60 57 53 51 Z" /><path d="M48 44 Q50 42 52 44" fill="none" /></g>
      ) : null}
      {earned.has('baseball-cap') ? (
        <g stroke="#2b2140" strokeWidth="3.5" strokeLinejoin="round"><path d="M30 29 Q34 10 53 11 Q68 13 70 30 Z" fill="#ffc93c" /><path d="M46 29 Q66 25 79 32 Q67 38 48 35 Z" fill="#ffc93c" /><path d="M52 12 L50 28" fill="none" opacity="0.45" /></g>
      ) : null}
      {earned.has('rain-boots') ? (
        <g fill="#2ec4b6" stroke="#2b2140" strokeWidth="3.5" strokeLinejoin="round"><path d="M29 72 L43 75 L41 88 Q32 94 24 87 L28 82 Z" /><path d="M57 75 L71 72 L72 82 L76 87 Q68 94 59 88 Z" /></g>
      ) : null}
    </svg>
  );
}
