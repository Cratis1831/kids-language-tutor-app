import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTimerOptions {
  seconds: number;
  /** When false, the countdown pauses (e.g. after the child has answered). */
  running: boolean;
  onExpire: () => void;
}

interface TimerState {
  /** Whole seconds remaining. */
  remaining: number;
  /** 0 → 1 fraction of time elapsed, for the visual ring. */
  fraction: number;
  reset: (seconds?: number) => void;
}

/**
 * A per-question countdown. Ticks every 100ms for a smooth ring, calls
 * `onExpire` once when it hits zero, and pauses when `running` is false.
 */
export function useTimer({ seconds, running, onExpire }: UseTimerOptions): TimerState {
  const [total, setTotal] = useState(seconds);
  const [remainingMs, setRemainingMs] = useState(seconds * 1000);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const reset = useCallback(
    (next?: number) => {
      const value = next ?? seconds;
      expiredRef.current = false;
      setTotal(value);
      setRemainingMs(value * 1000);
    },
    [seconds],
  );

  useEffect(() => {
    if (!running) return;
    const startedAt = Date.now();
    const startMs = remainingMs;
    const interval = setInterval(() => {
      const next = startMs - (Date.now() - startedAt);
      if (next <= 0) {
        setRemainingMs(0);
        if (!expiredRef.current) {
          expiredRef.current = true;
          onExpireRef.current();
        }
        clearInterval(interval);
      } else {
        setRemainingMs(next);
      }
    }, 100);
    return () => clearInterval(interval);
    // Re-arm only when running toggles; reset() drives fresh questions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, total]);

  const remaining = Math.ceil(remainingMs / 1000);
  const fraction = total > 0 ? 1 - remainingMs / (total * 1000) : 1;

  return { remaining, fraction, reset };
}
