import { Volume2 } from 'lucide-react';
import type { Locale } from '../../types';
import { useSpeech } from '../../hooks/useSpeech';
import { ui } from '../../i18n/ui';

interface SpeakerButtonProps {
  text: string;
  locale?: Locale;
  size?: number;
  className?: string;
}

/** A round button that reads its text aloud in the content language. */
export function SpeakerButton({ text, locale, size = 22, className = '' }: SpeakerButtonProps) {
  const { supported, speak } = useSpeech();
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text, locale);
      }}
      aria-label={`${ui.listen}: ${text}`}
      className={[
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
        'bg-lagoon/15 text-lagoon transition-transform active:scale-90',
        className,
      ].join(' ')}
    >
      <Volume2 size={size} aria-hidden="true" />
    </button>
  );
}
