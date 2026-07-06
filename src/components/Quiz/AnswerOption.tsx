import { Check, X } from 'lucide-react';
import type { AnswerOption as AnswerOptionType } from '../../types';
import { contentLocale, t } from '../../i18n/config';
import { SpeakerButton } from './SpeakerButton';

interface AnswerOptionProps {
  option: AnswerOptionType;
  answered: boolean;
  isCorrect: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export function AnswerOption({ option, answered, isCorrect, isSelected, onSelect }: AnswerOptionProps) {
  const label = t(option.label, contentLocale);

  let tone = 'bg-white border-cream-deep text-ink hover:border-grape';
  if (answered && isCorrect) tone = 'bg-lagoon/15 border-lagoon text-ink';
  else if (answered && isSelected && !isCorrect) tone = 'bg-berry/15 border-berry text-ink';
  else if (answered) tone = 'bg-white border-cream-deep text-ink/40';

  return (
    <button
      type="button"
      disabled={answered}
      onClick={onSelect}
      className={[
        'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left',
        'font-display text-lg font-semibold transition-all duration-100',
        'enabled:active:translate-y-0.5 disabled:cursor-default',
        tone,
      ].join(' ')}
    >
      <SpeakerButton text={label} size={20} />
      <span className="flex-1">{label}</span>
      {answered && isCorrect && <Check size={24} className="text-lagoon" aria-label="correct" />}
      {answered && isSelected && !isCorrect && <X size={24} className="text-berry" aria-label="wrong" />}
    </button>
  );
}
