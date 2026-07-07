import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { setMusicOn, setSoundOn, sfx, startMusic } from './audio';

// Persisted audio preferences. Music can only start after a user gesture
// (browser autoplay policy), so we listen for the first pointerdown.

const MUSIC_KEY = 'fla:music';
const SOUND_KEY = 'fla:sound';

interface AudioSettings {
  musicOn: boolean;
  soundOn: boolean;
  toggleMusic: () => void;
  toggleSound: () => void;
}

const SettingsContext = createContext<AudioSettings | null>(null);

function loadFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) !== '0';
  } catch {
    return true;
  }
}

function saveFlag(key: string, on: boolean): void {
  try {
    localStorage.setItem(key, on ? '1' : '0');
  } catch {
    // fine — the choice just won't persist
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [musicOn, setMusic] = useState(() => loadFlag(MUSIC_KEY));
  const [soundOn, setSound] = useState(() => loadFlag(SOUND_KEY));

  // Keep the audio engine's flags in sync.
  useEffect(() => setMusicOn(musicOn), [musicOn]);
  useEffect(() => setSoundOn(soundOn), [soundOn]);

  // Start the melody on the first tap/click anywhere (autoplay policy).
  useEffect(() => {
    const kickoff = () => startMusic();
    window.addEventListener('pointerdown', kickoff, { once: true });
    return () => window.removeEventListener('pointerdown', kickoff);
  }, []);

  const toggleMusic = useCallback(() => {
    setMusic((on) => {
      const next = !on;
      saveFlag(MUSIC_KEY, next);
      setMusicOn(next);
      if (next) startMusic(); // called from a click, so the context can resume
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSound((on) => {
      const next = !on;
      saveFlag(SOUND_KEY, next);
      setSoundOn(next);
      if (next) sfx.click(); // audible confirmation
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ musicOn, soundOn, toggleMusic, toggleSound }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useAudioSettings(): AudioSettings {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useAudioSettings must be used within a SettingsProvider');
  return ctx;
}
