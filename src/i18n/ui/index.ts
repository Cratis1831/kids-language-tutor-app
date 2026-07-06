import type { Locale } from '../../types';
import { uiLocale } from '../config';
import { fr, type UiStrings } from './fr';
import { en } from './en';

const tables: Record<string, UiStrings> = { fr, en };

/** The active UI string table, chosen by `uiLocale`. */
export const ui: UiStrings = tables[uiLocale] ?? fr;

/** Get a UI table for an explicit locale (falls back to French). */
export function uiFor(locale: Locale): UiStrings {
  return tables[locale] ?? fr;
}

export type { UiStrings };
