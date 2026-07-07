import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Question } from '../../types';
import { getProfile } from '../../state/profiles';
import { recordLevelResult } from '../../state/progress';
import { buildLevelsForDifficulty, TIER_TIME_FACTOR } from '../../data/levels';
import { getQuestion } from '../../data/questions';
import { useLocale } from '../../i18n/LocaleContext';
import { sfx } from '../../audio/audio';
import { useTimer } from '../../hooks/useTimer';
import { Button } from '../ui/Button';
import { Timer } from './Timer';
import { QuestionCard } from './QuestionCard';
import { ResultScreen } from './ResultScreen';

const TIMED_OUT = '__timeout__';

/** Stars from the score: 3 for perfect, 2 for 60%+, 1 for any correct, else 0. */
function starsFor(correct: number, total: number): number {
  if (total === 0) return 0;
  const ratio = correct / total;
  if (ratio >= 1) return 3;
  if (ratio >= 0.6) return 2;
  return correct > 0 ? 1 : 0;
}

/** Points: 10 per correct answer, +25 bonus for a perfect level. */
function pointsFor(correct: number, total: number): number {
  return correct * 10 + (total > 0 && correct === total ? 25 : 0);
}

/** Fisher-Yates shuffle (copy). */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

  const levels = profile ? buildLevelsForDifficulty(profile.difficulty) : [];
  const level = levels.find((l) => l.id === levelNumber);
  const baseQuestions: Question[] = (level?.questionIds ?? [])
    .map(getQuestion)
    .filter((q): q is Question => Boolean(q));

  // Options are shuffled once per playthrough (this component remounts per
  // level via its key, and replay() reshuffles).
  const [questions, setQuestions] = useState<Question[]>(() => prepareQuestions(baseQuestions));

  // Harder level tiers get less time per question.
  const timeFactor = TIER_TIME_FACTOR[level?.tier ?? 'easy'];
  const timeFor = (q: Question) => Math.max(8, Math.round(q.timerSeconds * timeFactor));

  const [index, setIndex] = useState(0);
  const [answeredId, setAnsweredId] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  // Ref guard so a click and a timeout can't both record an answer.
  const lockedRef = useRef(false);

  const question = questions[index];

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (lockedRef.current || !question) return;
      lockedRef.current = true;
      setAnsweredId(optionId);
      const isCorrect = optionId === question.correctOptionId;
      if (isCorrect) sfx.correct();
      else sfx.wrong();
      setResults((prev) => [...prev, isCorrect]);
    },
    [question],
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

  if (!profile || !level || baseQuestions.length === 0) {
    navigate(`/play/${profileId}`, { replace: true });
    return null;
  }

  const isLast = index === questions.length - 1;
  const correctCount = results.filter(Boolean).length;

  const goNext = () => {
    if (isLast) {
      const stars = starsFor(correctCount, questions.length);
      const points = pointsFor(correctCount, questions.length);
      recordLevelResult(profileId, level.id, stars, points, levels.length);
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const replay = () => {
    lockedRef.current = false;
    const fresh = prepareQuestions(baseQuestions); // new shuffle each replay
    setQuestions(fresh);
    setResults([]);
    setAnsweredId(null);
    setFinished(false);
    setIndex(0);
    reset(timeFor(fresh[0]));
  };

  if (finished) {
    const stars = starsFor(correctCount, questions.length);
    const hasNext = level.id < levels.length && level.id + 1 <= levels.length;
    return (
      <main className="mx-auto flex min-h-full max-w-2xl flex-col justify-center px-4 py-10">
        <ResultScreen
          stars={stars}
          correctCount={correctCount}
          total={questions.length}
          points={pointsFor(correctCount, questions.length)}
          hasNext={hasNext}
          onReplay={replay}
          onNext={() => navigate(`/play/${profileId}/level/${level.id + 1}`)}
          onMap={() => navigate(`/play/${profileId}`, { state: { justCompleted: level.id } })}
        />
      </main>
    );
  }

  const answered = answeredId !== null;

  return (
    <main className="mx-auto min-h-full max-w-2xl px-4 pb-16">
      <header className="flex items-center justify-between gap-2 py-4">
        <button
          onClick={() => navigate(`/play/${profileId}`)}
          className="flex shrink-0 items-center gap-1 rounded-xl px-1 py-1 font-display font-semibold text-grape"
        >
          <ChevronLeft size={22} aria-hidden="true" />
          <span className="hidden sm:inline">{ui.backToMap}</span>
        </button>
        <span className="min-w-0 flex-1 truncate text-center font-display text-sm font-semibold text-ink/70 sm:text-base">
          {ui.level} {level.id} · {ui.question} {index + 1} {ui.of} {questions.length}
        </span>
        <div className="shrink-0">
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
    </main>
  );
}
