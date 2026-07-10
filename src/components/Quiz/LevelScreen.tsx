import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Question } from '../../types';
import { getProfile } from '../../state/profiles';
import { loadProgress, loseLife, recordLevelResult } from '../../state/progress';
import {
  beginAttempt,
  clearAttempt,
  markAnswered,
  reconcileAttempt,
} from '../../state/attempt';
import {
  buildLevels,
  drawQuestionsForLevel,
  TIER_TIME_FACTOR,
} from '../../data/levels';
import {
  LIFE_LOST_ON_ABANDON,
  LIFE_LOST_ON_FAIL,
  PASS_THRESHOLD,
  TIER_POINTS,
} from '../../config/gameRules';
import { shuffleArray } from '../../utils/shuffle';
import { useLocale } from '../../i18n/LocaleContext';
import { sfx } from '../../audio/audio';
import { useTimer } from '../../hooks/useTimer';
import { Button } from '../ui/Button';
import { LivesDisplay } from '../ui/LivesDisplay';
import { Timer } from './Timer';
import { QuestionCard } from './QuestionCard';
import { ResultScreen } from './ResultScreen';
import { GameOverScreen } from './GameOverScreen';
import { GameMap } from '../GameMap/GameMap';

const TIMED_OUT = '__timeout__';

interface AttemptOutcome {
  passed: boolean;
  bonusLifeAwarded: boolean;
  gameOver: boolean;
  livesLeft: number;
}

type CompletionPhase = 'idle' | 'lifting' | 'moving' | 'restoring';

const LIFT_MS = 420;
const RESTORE_MS = 480;

/**
 * Stars from a passing score: 1 at the pass threshold, scaling up to 3 for a
 * perfect level. A failing score earns none (and is never recorded).
 */
function starsFor(correct: number, total: number): number {
  if (correct < PASS_THRESHOLD) return 0;
  const range = total - PASS_THRESHOLD;
  if (range <= 0) return 3;
  return Math.min(3, 1 + Math.round(((correct - PASS_THRESHOLD) / range) * 2));
}

/**
 * Shuffle each multiple-choice question's options for this playthrough so the
 * correct answer lands in a random position. True/false keeps Vrai/Faux order.
 */
function prepareQuestions(questions: Question[]): Question[] {
  return questions.map((q) =>
    q.type === 'multiple-choice' ? { ...q, options: shuffleArray(q.options) } : q,
  );
}

/**
 * Remount the game whenever the level in the URL changes. Without a keyed
 * remount, navigating to the next level reuses this component instance and its
 * "finished" / progress state would carry over from the previous level.
 */
export function LevelScreen() {
  const { levelId = '' } = useParams();
  return <LevelGame key={levelId} />;
}

function LevelGame() {
  const { profileId = '', levelId = '' } = useParams();
  const navigate = useNavigate();
  const { ui } = useLocale();
  const profile = getProfile(profileId);
  const levelNumber = Number(levelId);

  const levels = profile ? buildLevels() : [];
  const level = levels.find((l) => l.id === levelNumber);

  // One-time attempt setup: reconcile any dangling (abandoned) attempt, draw a
  // fresh set of questions for this playthrough, and start a new marker. The
  // pre-reconcile unlockedLevel snapshot gates access to this level below.
  const [init] = useState(() => {
    if (!profile || !level) return { valid: false as const };
    const snapshot = loadProgress(profileId);
    const reconcile = reconcileAttempt(profileId);
    const current = loadProgress(profileId); // lives after any abandon penalty
    const drawn = drawQuestionsForLevel(
      profileId,
      levelNumber,
      reconcile.lastQuestionIds ?? [],
    );
    beginAttempt(profileId, levelNumber, drawn.map((q) => q.id));
    return {
      valid: true as const,
      reconcile,
      unlockedSnapshot: snapshot.unlockedLevel,
      initialLives: current.lives,
      initialQuestions: prepareQuestions(drawn),
    };
  });

  const [questions, setQuestions] = useState<Question[]>(
    init.valid ? init.initialQuestions : [],
  );

  // Harder level tiers get less time per question.
  const timeFactor = TIER_TIME_FACTOR[level?.tier ?? 'easy'];
  const timeFor = (q: Question) => Math.max(8, Math.round(q.timerSeconds * timeFactor));

  const [index, setIndex] = useState(0);
  const [answeredId, setAnsweredId] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [outcome, setOutcome] = useState<AttemptOutcome | null>(null);
  const [lives, setLives] = useState(init.valid ? init.initialLives : 0);
  const [showAbandonBanner, setShowAbandonBanner] = useState(
    init.valid ? init.reconcile.penalized && !init.reconcile.gameOver : false,
  );
  const [completionPhase, setCompletionPhase] = useState<CompletionPhase>('idle');
  const [transitionPawnLevel, setTransitionPawnLevel] = useState(levelNumber);
  // Ref guard so a click and a timeout can't both record an answer.
  const lockedRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }
  }, []);

  const question = questions[index];

  useEffect(() => {
    if (!showAbandonBanner) return;
    const timer = setTimeout(() => setShowAbandonBanner(false), 3000);
    return () => clearTimeout(timer);
  }, [showAbandonBanner]);

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (lockedRef.current || !question || !level) return;
      lockedRef.current = true;
      setAnsweredId(optionId);
      const isCorrect = optionId === question.correctOptionId;
      if (isCorrect) sfx.correct();
      else sfx.wrong();

      const next = [...results, isCorrect];
      setResults(next);
      markAnswered(profileId, next.length);

      // Finalize the moment the last answer lands (not on the "Finish" button),
      // so refreshing before confirming can't dodge a failed level.
      if (next.length === questions.length) {
        clearAttempt(profileId);
        const correct = next.filter(Boolean).length;
        if (correct >= PASS_THRESHOLD) {
          const { progress, bonusLifeAwarded } = recordLevelResult(
            profileId,
            level.id,
            starsFor(correct, questions.length),
            levels.length,
          );
          setLives(progress.lives);
          setOutcome({
            passed: true,
            bonusLifeAwarded,
            gameOver: false,
            livesLeft: progress.lives,
          });
        } else {
          const { progress, gameOver } = loseLife(profileId, LIFE_LOST_ON_FAIL);
          setLives(progress.lives);
          setOutcome({
            passed: false,
            bonusLifeAwarded: false,
            gameOver,
            livesLeft: progress.lives,
          });
        }
      }
    },
    [question, results, questions.length, profileId, level, levels.length],
  );

  const { remaining, fraction, reset } = useTimer({
    seconds: question ? timeFor(question) : 20,
    running: answeredId === null && !finished && Boolean(question),
    onExpire: () => handleAnswer(TIMED_OUT),
  });

  // Fresh timer + cleared selection whenever we move to a new question.
  useEffect(() => {
    lockedRef.current = false;
    setAnsweredId(null);
    if (question) reset(timeFor(question));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, question, reset]);

  // Redirects (invalid target, game over from an abandoned attempt, or trying
  // to reach a locked / already-beaten level directly by URL).
  if (!init.valid || !profile || !level) {
    navigate(`/play/${profileId}`, { replace: true });
    return null;
  }
  if (init.reconcile.gameOver) {
    navigate(`/play/${profileId}`, { replace: true, state: { gameOver: true } });
    return null;
  }
  if (levelNumber !== init.unlockedSnapshot) {
    navigate(`/play/${profileId}`, { replace: true });
    return null;
  }

  const isLast = index === questions.length - 1;
  const correctCount = results.filter(Boolean).length;

  const goNext = () => {
    if (completionPhase !== 'idle') return;
    if (isLast) {
      // A pass gets a short map reveal before results. Keeping this local to the
      // level route means a refresh or interrupted animation cannot alter progress.
      if (outcome?.passed && level.id < levels.length) {
        lockedRef.current = true;
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        setCompletionPhase('lifting');
        transitionTimerRef.current = window.setTimeout(() => {
          setCompletionPhase('moving');
          setTransitionPawnLevel(level.id + 1);
        }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : LIFT_MS);
      } else {
        setFinished(true); // outcome was already applied when the last answer landed
      }
    } else {
      setIndex((i) => i + 1);
    }
  };

  const finishCompletionTransition = useCallback(() => {
    setCompletionPhase('restoring');
    transitionTimerRef.current = window.setTimeout(() => {
      setFinished(true);
      setCompletionPhase('idle');
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : RESTORE_MS);
  }, []);

  const replay = () => {
    lockedRef.current = false;
    const drawn = drawQuestionsForLevel(
      profileId,
      levelNumber,
      questions.map((q) => q.id),
    );
    beginAttempt(profileId, levelNumber, drawn.map((q) => q.id));
    const fresh = prepareQuestions(drawn);
    setQuestions(fresh);
    setResults([]);
    setAnsweredId(null);
    setFinished(false);
    setOutcome(null);
    setIndex(0);
    reset(timeFor(fresh[0]));
  };

  // Leaving mid-level: costs a life only if at least one question was answered
  // and the attempt hasn't already been finalized (outcome set).
  const quitToMap = () => {
    if (completionPhase !== 'idle') return;
    if (outcome === null) {
      clearAttempt(profileId);
      if (results.length > 0) {
        const { gameOver } = loseLife(profileId, LIFE_LOST_ON_ABANDON);
        navigate(`/play/${profileId}`, {
          state: gameOver ? { gameOver: true } : { lifeLost: true },
        });
        return;
      }
    }
    navigate(`/play/${profileId}`);
  };

  if (finished) {
    if (outcome?.gameOver) {
      return (
        <main className="mx-auto flex min-h-full max-w-2xl flex-col justify-center px-4 py-10">
          <GameOverScreen onRestart={() => navigate(`/play/${profileId}`)} />
        </main>
      );
    }
    const passed = outcome?.passed ?? false;
    const stars = passed ? starsFor(correctCount, questions.length) : 0;
    const hasNext = passed && level.id < levels.length;
    return (
      <main className="mx-auto flex min-h-full max-w-2xl flex-col justify-center px-4 py-10">
        <ResultScreen
          passed={passed}
          stars={stars}
          correctCount={correctCount}
          total={questions.length}
          points={passed ? TIER_POINTS[level.tier] : 0}
          hasNext={hasNext}
          livesLeft={outcome?.livesLeft ?? lives}
          bonusLifeAwarded={outcome?.bonusLifeAwarded ?? false}
          onRetry={replay}
          onNext={() => navigate(`/play/${profileId}/level/${level.id + 1}`)}
          onMap={() =>
            navigate(
              `/play/${profileId}`,
              passed ? { state: { justCompleted: level.id } } : undefined,
            )
          }
        />
      </main>
    );
  }

  const answered = answeredId !== null;
  const transitioning = completionPhase !== 'idle';
  const transitionProgress = transitioning ? loadProgress(profileId) : null;

  return (
    <main className="relative mx-auto min-h-full max-w-2xl overflow-hidden px-4 pb-16">
      {transitioning && transitionProgress && (
        <div
          className="completion-map-reveal absolute inset-x-0 top-0 z-0 min-h-full bg-cream/80 px-4 pt-3"
          aria-label={`${ui.level} ${level.id + 1}`}
          aria-live="polite"
        >
          <div
            className="completion-map-track"
            style={{ transform: `translateY(calc(42vh - ${90 + (level.id - 1) * 132}px))` }}
          >
            <GameMap
              levels={levels}
              progress={transitionProgress}
              pawnLevel={transitionPawnLevel}
              pawnColor={profile.color}
              levelLabel={ui.level}
              lockedLabel={ui.locked}
              completedLabel={ui.completedLabel}
              interactive={false}
              onSelect={() => undefined}
              onPawnMoveComplete={finishCompletionTransition}
            />
          </div>
        </div>
      )}
      <div
        className={`relative z-10 completion-quiz-shell completion-quiz-shell--${completionPhase} ${transitioning ? 'pointer-events-none select-none' : ''}`}
        aria-hidden={transitioning}
      >
      {showAbandonBanner && (
        <div className="-mx-4 mb-1 bg-berry px-4 py-2 text-center font-display text-sm font-bold text-white">
          {ui.lifeLostAbandon}
        </div>
      )}
      <header className="flex items-center justify-between gap-2 py-4">
        <button
          onClick={quitToMap}
          className="flex shrink-0 items-center gap-1 rounded-xl px-1 py-1 font-display font-semibold text-grape"
        >
          <ChevronLeft size={22} aria-hidden="true" />
          <span className="hidden sm:inline">{ui.backToMap}</span>
        </button>
        <span className="min-w-0 flex-1 truncate text-center font-display text-sm font-semibold text-ink/70 sm:text-base">
          {ui.level} {level.id} · {ui.question} {index + 1} {ui.of} {questions.length}
        </span>
        <div className="flex shrink-0 items-center gap-3">
          <LivesDisplay lives={lives} size={18} />
          <Timer remaining={remaining} fraction={fraction} />
        </div>
      </header>

      {/* Progress pips */}
      <div className="mb-5 flex gap-1.5" aria-hidden="true">
        {questions.map((_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i < results.length ? (results[i] ? 'bg-lagoon' : 'bg-berry') : i === index ? 'bg-grape' : 'bg-cream-deep'
            }`}
          />
        ))}
      </div>

      <QuestionCard question={question} answeredOptionId={answeredId} onAnswer={handleAnswer} />

      <div className="mt-6 min-h-[64px] text-center">
        {answered && (
          <>
            <p
              className={`mb-3 font-display text-xl font-bold ${
                answeredId === question.correctOptionId ? 'text-lagoon' : 'text-berry'
              }`}
            >
              {answeredId === TIMED_OUT
                ? ui.timeUp
                : answeredId === question.correctOptionId
                  ? ui.correct
                  : ui.notQuite}
            </p>
            <Button variant="primary" onClick={goNext}>
              {isLast ? ui.finishLevel : ui.nextQuestion}
            </Button>
          </>
        )}
      </div>
      </div>
    </main>
  );
}
