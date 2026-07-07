import { Music, Volume2, VolumeX } from 'lucide-react';
import { useAudioSettings } from '../../audio/SettingsContext';
import { useLocale } from '../../i18n/LocaleContext';

/** Round on/off buttons for the background music and the sound effects. */
export function SoundToggles() {
  const { musicOn, soundOn, toggleMusic, toggleSound } = useAudioSettings();
  const { ui } = useLocale();

  const buttonClass = (on: boolean) =>
    [
      'flex h-11 w-11 items-center justify-center rounded-full shadow-(--shadow-nub)',
      'transition-colors active:translate-y-0.5 active:shadow-none',
      on ? 'bg-lagoon text-white' : 'bg-white text-mist',
    ].join(' ');

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={musicOn}
        aria-label={ui.music}
        onClick={toggleMusic}
        className={buttonClass(musicOn)}
      >
        <Music size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={soundOn}
        aria-label={ui.sounds}
        onClick={toggleSound}
        className={buttonClass(soundOn)}
      >
        {soundOn ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
      </button>
    </div>
  );
}
