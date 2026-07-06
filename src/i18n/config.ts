import type { Locale, LocalizedText } from '../types';

// The language questions and answers are shown in. Change this (and add the
// matching locale keys to the content + UI strings) to support more languages.
export const contentLocale: Locale = 'fr';

// The language revealed when a child taps the hint button.
export const hintLocale: Locale = 'en';

// The language of the app chrome (buttons, labels, headings).
export const uiLocale: Locale = 'fr';

/** Read a localized string, falling back across locales so nothing renders blank. */
export function t(text: LocalizedText | undefined, locale: Locale): string {
  if (!text) return '';
  return text[locale] ?? text.fr ?? text.en ?? Object.values(text)[0] ?? '';
}
