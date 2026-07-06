import { useCallback, useEffect, useState } from 'react';
import type { Locale } from '../types';
import { contentLocale } from '../i18n/config';

// Maps our locale codes to BCP-47 speech language tags.
const localeToLang: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-US',
};

interface UseSpeech {
  /** True if the browser can speak (Web Speech API available with voices). */
  supported: boolean;
  /** Speak text in the given locale (defaults to the content locale). */
  speak: (text: string, locale?: Locale) => void;
  cancel: () => void;
}

/**
 * Thin wrapper over the browser's speechSynthesis. Picks a voice matching the
 * requested locale so French questions are read with a French voice. Degrades
 * gracefully (supported = false) when the API or voices are unavailable.
 */
export function useSpeech(): UseSpeech {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;

  useEffect(() => {
    if (!synth) return;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener?.('voiceschanged', load);
    return () => synth.removeEventListener?.('voiceschanged', load);
  }, [synth]);

  const pickVoice = useCallback(
    (locale: Locale): SpeechSynthesisVoice | undefined => {
      const lang = localeToLang[locale] ?? locale;
      const prefix = lang.split('-')[0];
      return (
        voices.find((v) => v.lang === lang) ??
        voices.find((v) => v.lang.startsWith(prefix))
      );
    },
    [voices],
  );

  const speak = useCallback(
    (text: string, locale: Locale = contentLocale) => {
      if (!synth || !text) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(locale);
      if (voice) utterance.voice = voice;
      utterance.lang = localeToLang[locale] ?? locale;
      utterance.rate = 0.9; // a touch slower for young learners
      synth.speak(utterance);
    },
    [synth, pickVoice],
  );

  const cancel = useCallback(() => synth?.cancel(), [synth]);

  const supported = Boolean(synth);

  return { supported, speak, cancel };
}
