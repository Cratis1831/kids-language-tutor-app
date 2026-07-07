// Tiny Web Audio engine: generated sound effects and a looping melody
// (Frère Jacques — fitting for a French game, and public domain). No audio
// files needed; everything is synthesized. All functions no-op safely when
// the Web Audio API is unavailable or the user has toggled audio off.

let ctx: AudioContext | null = null;
let soundOn = true;
let musicOn = true;
let musicRunning = false;
let musicNodes: OscillatorNode[] = [];
let musicTimeout: ReturnType<typeof setTimeout> | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function setSoundOn(on: boolean): void {
  soundOn = on;
}

export function setMusicOn(on: boolean): void {
  musicOn = on;
  if (!on) stopMusic();
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = c.currentTime + start;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  /** Soft tick for button presses. */
  click(): void {
    if (soundOn) tone(700, 0, 0.07, 'triangle', 0.1);
  },
  /** Cheerful two-note "ding" for a right answer. */
  correct(): void {
    if (!soundOn) return;
    tone(523.25, 0, 0.15, 'sine', 0.2);
    tone(659.25, 0.12, 0.22, 'sine', 0.2);
  },
  /** Gentle descending "wah" for a wrong answer or timeout. */
  wrong(): void {
    if (!soundOn) return;
    tone(233, 0, 0.2, 'sawtooth', 0.08);
    tone(196, 0.18, 0.28, 'sawtooth', 0.08);
  },
  /** Rising arpeggio when a level is finished. */
  levelDone(): void {
    if (!soundOn) return;
    [523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.13, 0.2, 'triangle', 0.16));
  },
  /** Bigger fanfare + sparkle for a perfect level. */
  perfect(): void {
    if (!soundOn) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.12, 0.25, 'triangle', 0.18));
    [1318.5, 1567.98].forEach((f, i) => tone(f, 0.55 + i * 0.09, 0.3, 'sine', 0.12));
  },
  /** Boing when the map token hops to the next level. */
  hop(): void {
    if (!soundOn) return;
    tone(392, 0, 0.1, 'sine', 0.12);
    tone(587.33, 0.08, 0.14, 'sine', 0.12);
  },
};

// --- Background melody: Frère Jacques, one soft triangle-wave voice ---

const G3 = 196.0;
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F4 = 349.23;
const G4 = 392.0;
const A4 = 440.0;

/** [frequency, beats] */
const MELODY: Array<[number, number]> = [
  [C4, 1], [D4, 1], [E4, 1], [C4, 1],
  [C4, 1], [D4, 1], [E4, 1], [C4, 1],
  [E4, 1], [F4, 1], [G4, 2],
  [E4, 1], [F4, 1], [G4, 2],
  [G4, 0.5], [A4, 0.5], [G4, 0.5], [F4, 0.5], [E4, 1], [C4, 1],
  [G4, 0.5], [A4, 0.5], [G4, 0.5], [F4, 0.5], [E4, 1], [C4, 1],
  [C4, 1], [G3, 1], [C4, 2],
  [C4, 1], [G3, 1], [C4, 2],
];
const SECONDS_PER_BEAT = 0.55;
const MUSIC_VOLUME = 0.05;

function scheduleMelodyOnce(): void {
  const c = getCtx();
  if (!c || !musicRunning) return;
  let offset = 0.1;
  for (const [freq, beats] of MELODY) {
    const dur = beats * SECONDS_PER_BEAT;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t0 = c.currentTime + offset;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(MUSIC_VOLUME, t0 + 0.03);
    gain.gain.setValueAtTime(MUSIC_VOLUME, t0 + dur * 0.7);
    gain.gain.linearRampToValueAtTime(0.0001, t0 + dur * 0.95);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur);
    musicNodes.push(osc);
    offset += dur;
  }
  // Queue the next pass just before this one ends.
  musicTimeout = setTimeout(() => {
    musicNodes = [];
    scheduleMelodyOnce();
  }, (offset - 0.2) * 1000);
}

export function startMusic(): void {
  if (!musicOn || musicRunning) return;
  if (!getCtx()) return;
  musicRunning = true;
  scheduleMelodyOnce();
}

export function stopMusic(): void {
  musicRunning = false;
  if (musicTimeout) {
    clearTimeout(musicTimeout);
    musicTimeout = null;
  }
  for (const node of musicNodes) {
    try {
      node.stop();
    } catch {
      // already stopped
    }
  }
  musicNodes = [];
}
