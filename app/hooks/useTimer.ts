// app/hooks/useTimer.ts — Hook timer générique : countdown OU countup, pause/resume/reset.
// Drift compensé par horodatage performance.now() (un simple setInterval dérive de plusieurs % sur de longues sessions).
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TIMER_TICK_MS } from "@/lib/constants";

export type TimerDirection = "countdown" | "countup";

export type UseTimerOptions = {
  /** Direction du timer. countdown : décompte depuis durationSeconds. countup : montée libre. */
  direction: TimerDirection;
  /** Pour countdown uniquement : durée totale en secondes. Ignoré en countup. */
  durationSeconds?: number;
  /** Démarrer automatiquement au montage. Défaut false. */
  autoStart?: boolean;
  /** Callback à chaque tick (~10Hz). seconds = restantes (countdown) ou écoulées (countup). */
  onTick?: (seconds: number) => void;
  /** Callback déclenché une fois quand un countdown atteint 0. Non appelé en countup. */
  onComplete?: () => void;
};

export type UseTimerReturn = {
  /** Secondes restantes (countdown) ou écoulées (countup). Précision sub-seconde via fractional. */
  seconds: number;
  /** Comme `seconds` mais en valeur réelle (float) — utile pour animer le cercle finement. */
  fractionalSeconds: number;
  /** True si le timer tourne (pas en pause, pas terminé). */
  isRunning: boolean;
  /** True si l'utilisateur a appuyé sur pause. */
  isPaused: boolean;
  /** True si countdown atteint 0. */
  isComplete: boolean;
  /** Progression normalisée [0..1]. En countdown = 1 - reste/total. En countup = elapsed/durationSeconds si défini, sinon 0. */
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: (newDurationSeconds?: number) => void;
  /** Saute à la fin (déclenche onComplete en countdown). */
  skip: () => void;
};

export function useTimer({
  direction,
  durationSeconds = 0,
  autoStart = false,
  onTick,
  onComplete,
}: UseTimerOptions): UseTimerReturn {
  const [fractional, setFractional] = useState<number>(
    direction === "countdown" ? durationSeconds : 0
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // refs pour éviter les stales closures dans le tick
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickAtRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(
    direction === "countdown" ? durationSeconds : 0
  );
  const durationRef = useRef<number>(durationSeconds);
  const directionRef = useRef<TimerDirection>(direction);
  const onTickRef = useRef<typeof onTick>(onTick);
  const onCompleteRef = useRef<typeof onComplete>(onComplete);
  const completedFiredRef = useRef<boolean>(false);
  const lastEmittedIntegerRef = useRef<number>(-1);

  // Sync refs sans relancer le timer
  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  }, [onTick, onComplete]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const clearInternalInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const now = performance.now();
    const deltaSec = (now - lastTickAtRef.current) / 1000;
    lastTickAtRef.current = now;

    if (directionRef.current === "countdown") {
      const next = Math.max(0, accumulatedRef.current - deltaSec);
      accumulatedRef.current = next;
      setFractional(next);

      const ceilSec = Math.ceil(next);
      if (ceilSec !== lastEmittedIntegerRef.current) {
        lastEmittedIntegerRef.current = ceilSec;
        onTickRef.current?.(ceilSec);
      }

      if (next <= 0 && !completedFiredRef.current) {
        completedFiredRef.current = true;
        clearInternalInterval();
        setIsRunning(false);
        setIsPaused(false);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    } else {
      const next = accumulatedRef.current + deltaSec;
      accumulatedRef.current = next;
      setFractional(next);

      const floorSec = Math.floor(next);
      if (floorSec !== lastEmittedIntegerRef.current) {
        lastEmittedIntegerRef.current = floorSec;
        onTickRef.current?.(floorSec);
      }
    }
  }, [clearInternalInterval]);

  const start = useCallback(() => {
    clearInternalInterval();
    accumulatedRef.current =
      directionRef.current === "countdown" ? durationRef.current : 0;
    setFractional(accumulatedRef.current);
    completedFiredRef.current = false;
    lastEmittedIntegerRef.current = -1;
    setIsComplete(false);
    setIsPaused(false);
    setIsRunning(true);
    lastTickAtRef.current = performance.now();
    intervalRef.current = setInterval(tick, TIMER_TICK_MS);
  }, [clearInternalInterval, tick]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    clearInternalInterval();
    setIsRunning(false);
    setIsPaused(true);
  }, [clearInternalInterval, isRunning]);

  const resume = useCallback(() => {
    if (!isPaused || isComplete) return;
    setIsPaused(false);
    setIsRunning(true);
    lastTickAtRef.current = performance.now();
    intervalRef.current = setInterval(tick, TIMER_TICK_MS);
  }, [isPaused, isComplete, tick]);

  const reset = useCallback(
    (newDurationSeconds?: number) => {
      clearInternalInterval();
      if (typeof newDurationSeconds === "number") {
        durationRef.current = newDurationSeconds;
      }
      accumulatedRef.current =
        directionRef.current === "countdown" ? durationRef.current : 0;
      setFractional(accumulatedRef.current);
      setIsRunning(false);
      setIsPaused(false);
      setIsComplete(false);
      completedFiredRef.current = false;
      lastEmittedIntegerRef.current = -1;
    },
    [clearInternalInterval]
  );

  const skip = useCallback(() => {
    if (directionRef.current === "countdown") {
      clearInternalInterval();
      accumulatedRef.current = 0;
      setFractional(0);
      setIsRunning(false);
      setIsPaused(false);
      setIsComplete(true);
      if (!completedFiredRef.current) {
        completedFiredRef.current = true;
        onCompleteRef.current?.();
      }
    } else {
      // En countup, skip = stop net.
      clearInternalInterval();
      setIsRunning(false);
      setIsPaused(false);
    }
  }, [clearInternalInterval]);

  // Re-sync durée si elle change pendant qu'on est à l'arrêt
  useEffect(() => {
    durationRef.current = durationSeconds;
    if (!isRunning && !isPaused && !isComplete) {
      accumulatedRef.current =
        directionRef.current === "countdown" ? durationSeconds : 0;
      setFractional(accumulatedRef.current);
    }
  }, [durationSeconds, isRunning, isPaused, isComplete]);

  // autoStart au montage uniquement
  useEffect(() => {
    if (autoStart) start();
    return () => clearInternalInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup
  useEffect(() => {
    return () => clearInternalInterval();
  }, [clearInternalInterval]);

  // Progress
  let progress = 0;
  if (direction === "countdown" && durationSeconds > 0) {
    progress = 1 - fractional / durationSeconds;
  } else if (direction === "countup" && durationSeconds > 0) {
    progress = Math.min(1, fractional / durationSeconds);
  }
  progress = Math.max(0, Math.min(1, progress));

  const displaySeconds =
    direction === "countdown" ? Math.ceil(fractional) : Math.floor(fractional);

  return {
    seconds: displaySeconds,
    fractionalSeconds: fractional,
    isRunning,
    isPaused,
    isComplete,
    progress,
    start,
    pause,
    resume,
    reset,
    skip,
  };
}
