import { useLocale } from '../../i18n/LocaleContext';

/**
 * A switch that keeps the app chrome (menus, buttons) in English.
 * Question content stays in the learning language regardless.
 */
export function LangToggle() {
  const { uiLocale, setUiLocale, ui } = useLocale();
  const on = uiLocale === 'en';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setUiLocale(on ? 'fr' : 'en')}
      className="inline-flex items-center gap-2 rounded-full bg-white/80 py-1.5 pl-4 pr-1.5
                 font-display text-sm font-semibold text-ink shadow-(--shadow-nub)"
    >
      {ui.englishMenus}
      <span
        aria-hidden="true"
        className={`relative h-7 w-12 rounded-full transition-colors ${on ? 'bg-lagoon' : 'bg-mist/60'}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
            on ? 'left-6' : 'left-1'
          }`}
        />
      </span>
    </button>
  );
}
