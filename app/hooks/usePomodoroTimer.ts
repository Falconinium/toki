// app/hooks/usePomodoroTimer.ts — Machine d'états Pomodoro.
// Cycle automatique : focus → short-break → focus → short-break → ... → focus → long-break (toutes les N) → recommence.
// S'appuie sur useTimer pour le décompte de chaque phase.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from "./useTimer";
import type { PomodoroPhase, PomodoroSettings } from "@/lib/types";

export type UsePomodoroTimerOptions = {
  settings: PomodoroSettings;
  /** Callback à chaque transition de phase. Utile pour les sons. */
  onPhaseChange?: (phase: PomodoroPhase, info: { completedPomodoros: number }) => void;
};

export type UsePomodoroTimerReturn = {
  phase: PomodoroPhase;
  completedPomodoros: number;
  /** Nombre de pomodoros à compléter avant la pause longue (vient des settings). */
  pomodorosBeforeLongBreak: number;
  /** Secondes restantes dans la phase courante. */
  secondsLeft: number;
  /** Progression dans la phase courante [0..1]. */
  phaseProgress: number;
  isRunning: boolean;
  isPaused: boolean;
  isDone: boolean;
  /** Démarre la phase suivante (focus si idle, sinon la phase déjà planifiée). */
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  /** Saute à la fin de la phase courante (déclenche la transition). */
  skipPhase: () => void;
};

function phaseDurationSeconds(s: PomodoroSettings, phase: PomodoroPhase): number {
  switch (phase) {
    case "focus":
      return s.focusMinutes * 60;
    case "short-break":
      return s.shortBreakMinutes * 60;
    case "long-break":
      return s.longBreakMinutes * 60;
    default:
      return 0;
  }
}

export function usePomodoroTimer({
  settings,
  onPhaseChange,
}: UsePomodoroTimerOptions): UsePomodoroTimerReturn {
  const [phase, setPhase] = useState<PomodoroPhase>("idle");
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);

  const phaseRef = useRef<PomodoroPhase>("idle");
  const completedRef = useRef<number>(0);
  const settingsRef = useRef<PomodoroSettings>(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    completedRef.current = completedPomodoros;
  }, [completedPomodoros]);

  const onPhaseChangeRef = useRef<typeof onPhaseChange>(onPhaseChange);
  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);

  const sub = useTimer({
    direction: "countdown",
    durationSeconds: 0,
    onComplete: () => {
      advancePhase();
    },
  });

  const enterPhase = useCallback(
    (next: PomodoroPhase, completed: number) => {
      setPhase(next);
      setCompletedPomodoros(completed);
      phaseRef.current = next;
      completedRef.current = completed;

      onPhaseChangeRef.current?.(next, { completedPomodoros: completed });

      if (next === "idle") {
        sub.reset(0);
        return;
      }
      const dur = phaseDurationSeconds(settingsRef.current, next);
      if (dur <= 0) {
        queueMicrotask(() => advancePhase());
        return;
      }
      sub.reset(dur);
      sub.start();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sub.reset, sub.start]
  );

  const advancePhase = useCallback(() => {
    const s = settingsRef.current;
    const cur = phaseRef.current;
    const completed = completedRef.current;

    switch (cur) {
      case "focus": {
        const newCompleted = completed + 1;
        // Pause longue toutes les N pomodoros, sinon courte. Le cycle continue indéfiniment.
        const isLongBreak = newCompleted % s.pomodorosBeforeLongBreak === 0;
        enterPhase(isLongBreak ? "long-break" : "short-break", newCompleted);
        return;
      }
      case "short-break":
      case "long-break":
        enterPhase("focus", completed);
        return;
      default:
        return;
    }
  }, [enterPhase]);

  const start = useCallback(() => {
    // Si idle, démarre par un focus. Sinon, reprendre l'état courant si possible.
    if (phaseRef.current === "idle") {
      enterPhase("focus", 0);
    }
  }, [enterPhase]);

  const pause = useCallback(() => {
    sub.pause();
  }, [sub]);

  const resume = useCallback(() => {
    sub.resume();
  }, [sub]);

  const reset = useCallback(() => {
    sub.reset(0);
    setPhase("idle");
    setCompletedPomodoros(0);
    phaseRef.current = "idle";
    completedRef.current = 0;
    onPhaseChangeRef.current?.("idle", { completedPomodoros: 0 });
  }, [sub]);

  const skipPhase = useCallback(() => {
    if (phaseRef.current === "idle") return;
    sub.skip();
  }, [sub]);

  // Le Pomodoro tourne en boucle infinie → isDone n'existe pas vraiment, on garde false.
  const isDone = false;
  const isRunning = sub.isRunning && phase !== "idle";
  const isPaused = sub.isPaused;

  return {
    phase,
    completedPomodoros,
    pomodorosBeforeLongBreak: settings.pomodorosBeforeLongBreak,
    secondsLeft: sub.seconds,
    phaseProgress: sub.progress,
    isRunning,
    isPaused,
    isDone,
    start,
    pause,
    resume,
    reset,
    skipPhase,
  };
}
