import { ui } from '../../i18n/ui';
import { Button } from '../ui/Button';
import { Stars } from '../ui/Stars';

interface ResultScreenProps {
  stars: number;
  correctCount: number;
  total: number;
  hasNext: boolean;
  onReplay: () => void;
  onNext: () => void;
  onMap: () => void;
}

export function ResultScreen({
  stars,
  correctCount,
  total,
  hasNext,
  onReplay,
  onNext,
  onMap,
}: ResultScreenProps) {
  return (
    <div className="mx-auto max-w-md rounded-[var(--radius-blob)] bg-white p-8 text-center shadow-[var(--shadow-pop)]">
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
