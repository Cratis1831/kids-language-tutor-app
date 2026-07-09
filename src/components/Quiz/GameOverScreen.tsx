import { HeartCrack } from 'lucide-react';
import { useLocale } from '../../i18n/LocaleContext';
import { Button } from '../ui/Button';

interface GameOverScreenProps {
  onRestart: () => void;
}

/**
 * Shown when a player runs out of lives. Their progress has already been reset
 * by loseLife, so the only action is to head back to a fresh map at level 1.
 */
export function GameOverScreen({ onRestart }: GameOverScreenProps) {
  const { ui } = useLocale();
  return (
    <div className="relative mx-auto max-w-md rounded-(--radius-blob) bg-white p-8 text-center shadow-(--shadow-pop)">
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-berry/15">
        <HeartCrack size={52} className="text-berry" strokeWidth={2.2} aria-hidden="true" />
      </div>

      <h2 className="font-display text-3xl font-bold text-berry">{ui.gameOver}</h2>
      <p className="mt-4 font-display text-lg text-ink/80">{ui.gameOverMessage}</p>

      <div className="mt-8">
        <Button variant="primary" onClick={onRestart}>
          {ui.restartAdventure}
        </Button>
      </div>
    </div>
  );
}
