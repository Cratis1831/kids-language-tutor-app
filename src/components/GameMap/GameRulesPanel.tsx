import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Heart,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { categories } from '../../data/categories';
import { t } from '../../i18n/config';
import type { UiStrings } from '../../i18n/ui';
import { TIER_POINTS } from '../../config/gameRules';
import type { Locale } from '../../types';
import { TierFlag } from './TierFlag';

function RulesContent({ ui, locale }: { ui: UiStrings; locale: Locale }) {
  const rules = [
    { Icon: CheckCircle2, text: ui.ruleQuestions, color: 'text-lagoon' },
    { Icon: Trophy, text: ui.rulePoints, color: 'text-sunshine' },
    { Icon: Clock3, text: ui.ruleTimers, color: 'text-grape' },
    { Icon: Heart, text: ui.ruleLives, color: 'text-berry' },
    { Icon: XCircle, text: ui.rulePenalties, color: 'text-berry' },
    { Icon: Sparkles, text: ui.ruleBonus, color: 'text-sunshine' },
    { Icon: Heart, text: ui.ruleGameOver, color: 'text-grape' },
  ];

  return (
    <div className="space-y-5">
      <ul className="space-y-3">
        {rules.map(({ Icon, text, color }) => (
          <li key={text} className="flex gap-3 text-sm font-semibold leading-snug text-ink/75">
            <Icon size={19} className={`mt-0.5 shrink-0 ${color}`} aria-hidden="true" />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <div className="border-t-2 border-cream-deep pt-4">
        <h3 className="mb-2 font-display text-sm font-bold text-ink/60">{ui.tierLegend}</h3>
        <div className="space-y-2">
          {(
            [
              ['easy', ui.tierEasy],
              ['medium', ui.tierMedium],
              ['hard', ui.tierHard],
            ] as const
          ).map(([tier, label]) => (
            <div key={tier} className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <TierFlag tier={tier} size={17} />
              <span className="flex-1">{label}</span>
              <span className="font-display font-bold text-grape">
                {TIER_POINTS[tier]} {ui.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-cream-deep pt-4">
        <h3 className="mb-2 font-display text-sm font-bold text-ink/60">{ui.categoryLegend}</h3>
        <div className="flex flex-wrap gap-x-3 gap-y-2">
          {Object.values(categories).map((category) => (
            <span key={category.id} className="flex items-center gap-1.5 text-sm font-semibold text-ink/70">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: category.color }}
                aria-hidden="true"
              />
              {t(category.name, locale)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface GameRulesPanelProps {
  ui: UiStrings;
  locale: Locale;
  minimized: boolean;
  onToggleMinimized: () => void;
}

export function GameRulesPanel({
  ui,
  locale,
  minimized,
  onToggleMinimized,
}: GameRulesPanelProps) {
  return (
    <>
      <details className="group mb-4 rounded-lg border-2 border-cream-deep bg-white shadow-(--shadow-nub) lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-display font-bold text-grape">
          <BookOpen size={21} aria-hidden="true" />
          <span className="flex-1">{ui.gameRules}</span>
          <ChevronDown
            size={20}
            className="transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="border-t-2 border-cream-deep px-4 py-4">
          <RulesContent ui={ui} locale={locale} />
        </div>
      </details>

      <aside
        className={[
          'sticky top-20 hidden self-start -translate-x-[30px] rounded-lg border-2',
          'border-cream-deep bg-white shadow-(--shadow-pop) lg:block',
          minimized ? 'p-1.5' : 'p-5',
        ].join(' ')}
      >
        {minimized ? (
          <button
            type="button"
            onClick={onToggleMinimized}
            aria-label={ui.maximizeRules}
            title={ui.maximizeRules}
            className="flex h-10 w-10 items-center justify-center rounded-md text-grape transition-colors hover:bg-cream-deep"
          >
            <PanelLeftOpen size={22} aria-hidden="true" />
          </button>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="flex min-w-0 flex-1 items-center gap-2 font-display text-xl font-bold text-grape">
                <BookOpen size={23} className="shrink-0" aria-hidden="true" />
                {ui.gameRules}
              </h2>
              <button
                type="button"
                onClick={onToggleMinimized}
                aria-label={ui.minimizeRules}
                title={ui.minimizeRules}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-grape transition-colors hover:bg-cream-deep"
              >
                <PanelLeftClose size={20} aria-hidden="true" />
              </button>
            </div>
            <RulesContent ui={ui} locale={locale} />
          </>
        )}
      </aside>
    </>
  );
}
