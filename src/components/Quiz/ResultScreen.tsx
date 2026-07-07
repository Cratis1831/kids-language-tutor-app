import { useEffect } from 'react';
import { useLocale } from '../../i18n/LocaleContext';
import { sfx } from '../../audio/audio';
import { Button } from '../ui/Button';
import { Stars } from '../ui/Stars';
import { ConfettiBurst } from './ConfettiBurst';

interface ResultScreenProps {
  stars: number;
  correctCount: number;
  total: number;
  points: number;
  hasNext: boolean;
  onReplay: () => void;
  onNext: () => void;
  onMap: () => void;
}

export function ResultScreen({
  stars,
  correctCount,
  total,
  points,
  hasNext,
  onReplay,
  onNext,
  onMap,
}: ResultScreenProps) {
  const { ui } = useLocale();
  const perfect = total > 0 && correctCount === total;

  // Celebration jingle when the results appear.
  useEffect(() => {
    if (perfect) sfx.perfect();
    else sfx.levelDone();
  }, [perfect]);

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

      <div className="mt-8 flex flex-col gap-3">
        {hasNext && (
          <Button variant="primary" onClick={onNext}>
            {ui.nextLevel}
          </Button>
        )}
        <Button variant="sun" onClick={onReplay}>
          {ui.playAgain}
        </Button>
        <Button variant="soft" onClick={onMap}>
          {ui.backToMap}
        </Button>
      </div>
    </div>
  );
}
