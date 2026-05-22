// app/hooks/useSportTimer.ts — Machine d'états Sport : chaîne countdown → (effort → repos) × sets → round-rest → ... × rounds → done.
// S'appuie sur useTimer pour le décompte de chaque phase et déclenche les transitions via onComplete.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from "./useTimer";
import type { SportPhase, SportSettings } from "@/lib/types";

export type UseSportTimerOptions = {
  settings: SportSettings;
  /** Callback à chaque transition de phase. Utile pour déclencher les sons (Phase 4). */
  onPhaseChange?: (phase: SportPhase, info: { set: number; round: number }) => void;
  /** Callback à chaque dernière seconde des 3 dernières d'un effort/repos. */
  onLastSecondTick?: (secondsLeft: number) => void;
};

export type UseSportTimerReturn = {
  phase: SportPhase;
  /** 1-indexed. */
  currentSet: number;
  currentRound: number;
  totalSets: number;
  totalRounds: number;
  /** Secondes restantes dans la phase courante. */
  secondsLeft: number;
  /** Progression dans la phase courante [0..1]. */
  phaseProgress: number;
  /** Progression globale sur l'ensemble de la séance [0..1]. */
  globalProgress: number;
  isRunning: boolean;
  isPaused: boolean;
  isDone: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  /** Saute à la phase suivante. */
  skipPhase: () => void;
};

// Durée totale théorique d'une séance, pour la global progress
function computeTotalSeconds(s: SportSettings): number {
  const perRound = s.sets * s.effortSeconds + Math.max(0, s.sets - 1) * s.restSeconds;
  const total =
    s.rounds * perRound + Math.max(0, s.rounds - 1) * s.restBetweenRoundsSeconds;
  return total;
}

// Secondes "consommées" jusqu'à l'entrée d'une phase donnée (avant son tick)
function computeElapsedBeforePhase(
  s: SportSettings,
  phase: SportPhase,
  set: number,
  round: number
): number {
  if (phase === "idle" || phase === "countdown") return 0;
  if (phase === "done") return computeTotalSeconds(s);

  const finishedRounds = round - 1;
  const perRound = s.sets * s.effortSeconds + Math.max(0, s.sets - 1) * s.restSeconds;
  let elapsed =
    finishedRounds * perRound + finishedRounds * s.restBetweenRoundsSeconds;

  const finishedSetsInRound = set - 1;
  elapsed += finishedSetsInRound * (s.effortSeconds + s.restSeconds);

  if (phase === "rest") elapsed += s.effortSeconds;
  // 'effort' : rien de plus à ajouter ; on est au début de cette phase
  // 'round-rest' : tous les sets du round sont finis
  if (phase === "round-rest") {
    elapsed = round * perRound + finishedRounds * s.restBetweenRoundsSeconds;
  }
  return elapsed;
}

function phaseDuration(s: SportSettings, phase: SportPhase): number {
  switch (phase) {
    case "countdown":
      return s.startCountdownEnabled ? s.startCountdownSeconds : 0;
    case "effort":
      return s.effortSeconds;
    case "rest":
      return s.restSeconds;
    case "round-rest":
      return s.restBetweenRoundsSeconds;
    default:
      return 0;
  }
}

export function useSportTimer({
  settings,
  onPhaseChange,
  onLastSecondTick,
}: UseSportTimerOptions): UseSportTimerReturn {
  const [phase, setPhase] = useState<SportPhase>("idle");
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [currentRound, setCurrentRound] = useState<number>(1);

  // refs pour le moteur de transition (évite stale closures dans onComplete)
  const phaseRef = useRef<SportPhase>("idle");
  const setRef = useRef<number>(1);
  const roundRef = useRef<number>(1);
  const settingsRef = useRef<SportSettings>(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    setRef.current = currentSet;
  }, [currentSet]);
  useEffect(() => {
    roundRef.current = currentRound;
  }, [currentRound]);

  const onPhaseChangeRef = useRef<typeof onPhaseChange>(onPhaseChange);
  const onLastSecondTickRef = useRef<typeof onLastSecondTick>(onLastSecondTick);
  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
    onLastSecondTickRef.current = onLastSecondTick;
  }, [onPhaseChange, onLastSecondTick]);

  // Sous-timer pour la phase courante. La durée est rechargée à chaque transition via reset(newDuration).
  const sub = useTimer({
    direction: "countdown",
    durationSeconds: 0,
    onTick: (secondsLeft) => {
      // Sons de rappel : 3 dernières secondes d'effort/repos + chaque seconde du countdown de démarrage
      const p = phaseRef.current;
      if (p === "countdown" && secondsLeft > 0 && secondsLeft <= 3) {
        onLastSecondTickRef.current?.(secondsLeft);
      } else if ((p === "effort" || p === "rest") && secondsLeft > 0 && secondsLeft <= 3) {
        onLastSecondTickRef.current?.(secondsLeft);
      }
    },
    onComplete: () => {
      advancePhase();
    },
  });

  const enterPhase = useCallback(
    (next: SportPhase, set: number, round: number) => {
      setPhase(next);
      setCurrentSet(set);
      setCurrentRound(round);
      phaseRef.current = next;
      setRef.current = set;
      roundRef.current = round;

      onPhaseChangeRef.current?.(next, { set, round });

      const dur = phaseDuration(settingsRef.current, next);
      if (next === "done" || next === "idle") {
        sub.reset(0);
        return;
      }
      // Si phase de durée 0 (ex: countdown désactivé), on saute direct
      if (dur <= 0) {
        // Differer pour éviter d'avancer dans un setState
        queueMicrotask(() => advancePhase());
        return;
      }
      sub.reset(dur);
      sub.start();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sub.reset, sub.start]
  );

  // Fonction de transition : calcule la phase suivante depuis l'état courant.
  const advancePhase = useCallback(() => {
    const s = settingsRef.current;
    const cur = phaseRef.current;
    const set = setRef.current;
    const round = roundRef.current;

    switch (cur) {
      case "countdown":
        enterPhase("effort", 1, round);
        return;

      case "effort": {
        const lastSetInRound = set >= s.sets;
        const lastRound = round >= s.rounds;

        if (!lastSetInRound) {
          // Il reste des sets : passer en repos (sauf si restSeconds = 0, on enchaîne)
          if (s.restSeconds > 0) {
            enterPhase("rest", set, round);
          } else {
            enterPhase("effort", set + 1, round);
          }
          return;
        }
        // Dernier set du round
        if (lastRound) {
          enterPhase("done", set, round);
          return;
        }
        // Passer au round suivant via le round-rest (sauf si 0)
        if (s.restBetweenRoundsSeconds > 0) {
          enterPhase("round-rest", set, round);
        } else {
          enterPhase("effort", 1, round + 1);
        }
        return;
      }

      case "rest": {
        // Le repos se déclenche entre deux sets — on passe au set suivant
        enterPhase("effort", set + 1, round);
        return;
      }

      case "round-rest": {
        enterPhase("effort", 1, round + 1);
        return;
      }

      default:
        return;
    }
  }, [enterPhase]);

  const start = useCallback(() => {
    const s = settingsRef.current;
    if (s.startCountdownEnabled && s.startCountdownSeconds > 0) {
      enterPhase("countdown", 1, 1);
    } else {
      enterPhase("effort", 1, 1);
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
    setCurrentSet(1);
    setCurrentRound(1);
    phaseRef.current = "idle";
    setRef.current = 1;
    roundRef.current = 1;
    onPhaseChangeRef.current?.("idle", { set: 1, round: 1 });
  }, [sub]);

  const skipPhase = useCallback(() => {
    // Force la fin de la phase courante (déclenche onComplete → advancePhase)
    if (phaseRef.current === "idle" || phaseRef.current === "done") return;
    sub.skip();
  }, [sub]);

  // Si l'utilisateur change les settings pendant qu'on est au repos (idle),
  // pas besoin de toucher au sous-timer. En cours de séance, on ignore (respecte la session live).

  const isDone = phase === "done";
  const isRunning = sub.isRunning && !isDone;
  const isPaused = sub.isPaused;

  const phaseProgress = sub.progress;
  const totalSeconds = computeTotalSeconds(settings);
  const elapsedBefore = computeElapsedBeforePhase(
    settings,
    phase,
    currentSet,
    currentRound
  );
  const elapsedInPhase =
    phase === "idle" || phase === "countdown" || phase === "done"
      ? 0
      : phaseDuration(settings, phase) - sub.fractionalSeconds;
  const globalProgress =
    phase === "done"
      ? 1
      : totalSeconds > 0
      ? Math.min(1, Math.max(0, (elapsedBefore + elapsedInPhase) / totalSeconds))
      : 0;

  return {
    phase,
    currentSet,
    currentRound,
    totalSets: settings.sets,
    totalRounds: settings.rounds,
    secondsLeft: sub.seconds,
    phaseProgress,
    globalProgress,
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
