import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Locale } from '../types';
import { uiLocale as defaultUiLocale } from './config';
import { uiFor, type UiStrings } from './ui';

// Runtime UI-language state. This only affects the app chrome (menus, buttons,
// labels) — question content always renders in `contentLocale`.

const STORAGE_KEY = 'fla:uiLocale';

interface LocaleContextValue {
  uiLocale: Locale;
  ui: UiStrings;
  setUiLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function loadStoredLocale(): Locale {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'fr' || raw === 'en') return raw;
  } catch {
    // storage unavailable — fall through to the default
  }
  return defaultUiLocale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [uiLocale, setUiLocaleState] = useState<Locale>(loadStoredLocale);

  const setUiLocale = useCallback((locale: Locale) => {
    setUiLocaleState(locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // fine — the choice just won't persist
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ uiLocale, ui: uiFor(uiLocale), setUiLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}
