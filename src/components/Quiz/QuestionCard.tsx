import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import type { Question } from '../../types';
import { contentLocale, hintLocale, t } from '../../i18n/config';
import { ui } from '../../i18n/ui';
import { SpeakerButton } from './SpeakerButton';
import { AnswerOption } from './AnswerOption';

interface QuestionCardProps {
  question: Question;
  answeredOptionId: string | null;
  onAnswer: (optionId: string) => void;
}

export function QuestionCard({ question, answeredOptionId, onAnswer }: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false);
  const promptText = t(question.prompt, contentLocale);
  const hintText = t(question.prompt, hintLocale);
  const answered = answeredOptionId !== null;

  return (
    <div className="rounded-[var(--radius-blob)] bg-white p-5 shadow-[var(--shadow-pop)] sm:p-7">
      <div className="mb-4 flex items-start gap-3">
        <SpeakerButton text={promptText} className="mt-1" />
        <h2 className="flex-1 font-display text-2xl font-bold leading-snug text-ink sm:text-3xl">
          {promptText}
        </h2>
      </div>

      <div className="mb-5">
        <button
          type="button"
          onClick={() => setShowHint((s) => !s)}
          aria-expanded={showHint}
          className="inline-flex items-center gap-2 rounded-full bg-sunshine/20 px-4 py-2
                     font-display font-semibold text-ink transition-colors hover:bg-sunshine/35"
        >
          <Lightbulb size={20} aria-hidden="true" />
          {showHint ? ui.hideHint : ui.showHint}
        </button>
        {showHint && (
          <p className="mt-3 rounded-2xl bg-sunshine/15 px-4 py-3 text-lg text-ink/80">
            <span className="mr-2 font-display text-sm font-bold uppercase tracking-wide text-ink/50">
              {ui.hintLabel}
            </span>
            {hintText}
          </p>
        )}
      </div>

      <div className="grid gap-3">
        {question.options.map((option) => (
          <AnswerOption
            key={option.id}
            option={option}
            answered={answered}
            isCorrect={option.id === question.correctOptionId}
            isSelected={option.id === answeredOptionId}
            onSelect={() => onAnswer(option.id)}
          />
        ))}
      </div>
    </div>
  );
}
