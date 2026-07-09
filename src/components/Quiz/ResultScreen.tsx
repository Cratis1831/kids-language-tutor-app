import { useEffect } from 'react';
import { HeartCrack } from 'lucide-react';
import { useLocale } from '../../i18n/LocaleContext';
import { sfx } from '../../audio/audio';
import { PASS_THRESHOLD } from '../../config/gameRules';
import { Button } from '../ui/Button';
import { Stars } from '../ui/Stars';
import { LivesDisplay } from '../ui/LivesDisplay';
import { ConfettiBurst } from './ConfettiBurst';

interface ResultScreenProps {
  passed: boolean;
  stars: number;
  correctCount: number;
  total: number;
  points: number;
  hasNext: boolean;
  livesLeft: number;
  bonusLifeAwarded: boolean;
  onRetry: () => void;
  onNext: () => void;
  onMap: () => void;
}

export function ResultScreen({
  passed,
  stars,
  correctCount,
  total,
  points,
  hasNext,
  livesLeft,
  bonusLifeAwarded,
  onRetry,
  onNext,
  onMap,
}: ResultScreenProps) {
  const { ui } = useLocale();
  const perfect = passed && total > 0 && correctCount === total;

  // Sound when the results appear: a jingle on a pass, a soft "wah" on a fail.
  useEffect(() => {
    if (!passed) sfx.wrong();
    else if (perfect) sfx.perfect();
    else sfx.levelDone();
  }, [passed, perfect]);

  if (!passed) {
    return (
      <div className="relative mx-auto max-w-md rounded-(--radius-blob) bg-white p-8 text-center shadow-(--shadow-pop)">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-berry/15">
          <HeartCrack size={44} className="text-berry" strokeWidth={2.2} aria-hidden="true" />
        </div>

        <h2 className="font-display text-3xl font-bold text-berry">{ui.levelFailed}</h2>

        <p className="mt-4 font-display text-xl text-ink">
          {ui.youScored}{' '}
          <span className="font-bold text-berry">
            {correctCount} {ui.outOf} {total}
          </span>
        </p>
        <p className="mt-2 font-display text-ink/70">
          {ui.passRequirement.replace('{count}', String(PASS_THRESHOLD))}
        </p>

        <div className="mt-5 flex flex-col items-center gap-2">
          <p className="font-display font-semibold text-berry">{ui.lifeLost}</p>
          <LivesDisplay lives={livesLeft} size={26} />
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button variant="primary" onClick={onRetry}>
            {ui.tryAgain}
          </Button>
          <Button variant="soft" onClick={onMap}>
            {ui.backToMap}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-md rounded-(--radius-blob) bg-white p-8 text-center shadow-(--shadow-pop)">
      {perfect && <ConfettiBurst />}

      {perfect && (
        <div
          className="pointer-events-none absolute -top-5 left-1/2 z-10 -translate-x-1/2 -rotate-6
                     rounded-2xl border-4 border-white bg-berry px-5 py-1.5 font-display text-2xl
                     font-bold text-white shadow-(--shadow-nub)"
        >
          {ui.perfect}
        </div>
      )}

      <h2 className="font-display text-3xl font-bold text-grape">{ui.levelComplete}</h2>

      <div className="my-6 flex justify-center">
        <Stars count={stars} size={52} />
      </div>

      <p className="font-display text-xl text-ink">
        {ui.youScored}{' '}
        <span className="font-bold text-lagoon">
          {correctCount} {ui.outOf} {total}
        </span>
      </p>
      <p className="mt-2 font-display text-2xl font-bold text-sunshine drop-shadow-[0_1px_0_rgba(43,33,64,0.25)]">
        +{points} {ui.points}
      </p>

      {bonusLifeAwarded && (
        <div className="mt-5 flex flex-col items-center gap-2">
          <p className="font-display font-semibold text-berry">{ui.bonusLife}</p>
          <LivesDisplay lives={livesLeft} size={26} />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {hasNext && (
          <Button variant="primary" onClick={onNext}>
            {ui.nextLevel}
          </Button>
        )}
        <Button variant="soft" onClick={onMap}>
          {ui.backToMap}
        </Button>
      </div>
    </div>
  );
}
