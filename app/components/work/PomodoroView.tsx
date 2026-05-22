// app/components/work/PomodoroView.tsx — Mode Pomodoro (ポモドーロ) : focus 25min / pauses / cycle automatique.
// Indigo en focus, sakura en pause. PomodoroCounter en pierres de go. Slot ZenQuote prêt pour Phase 6.
"use client";

import { useCallback, useRef, useState } from "react";
import { CircleTimer, type CircleTimerColor } from "@/app/components/timer/CircleTimer";
import { TimerControls } from "@/app/components/timer/TimerControls";
import { TimerDisplay } from "@/app/components/timer/TimerDisplay";
import { PomodoroCounter } from "./PomodoroCounter";
import { PomodoroSettingsPanel } from "./PomodoroSettings";
import { ZenQuote } from "./ZenQuote";
import { usePomodoroTimer } from "@/app/hooks/usePomodoroTimer";
import { useSoundContext } from "@/app/components/audio/SoundProvider";
import { POMODORO_DEFAULTS } from "@/lib/constants";
import { pickRandomQuote } from "@/lib/quotes";
import type { PomodoroPhase, PomodoroSettings, ZenQuote as ZenQuoteType } from "@/lib/types";

const PHASE_LABEL: Record<PomodoroPhase, { fr: string; jp: string }> = {
  idle: { fr: "Prêt", jp: "準備" },
  focus: { fr: "Concentration", jp: "集中" },
  "short-break": { fr: "Repos", jp: "休憩" },
  "long-break": { fr: "Repos long", jp: "長い休憩" },
  done: { fr: "Terminé", jp: "完了" },
};

const PHASE_COLOR: Record<PomodoroPhase, CircleTimerColor> = {
  idle: "sumi",
  focus: "ai",
  "short-break": "sakura",
  "long-break": "sakura",
  done: "sumi",
};

export function PomodoroView() {
  const [settings, setSettings] = useState<PomodoroSettings>(POMODORO_DEFAULTS);
  const [quote, setQuote] = useState<ZenQuoteType | null>(null);
  const [quoteKey, setQuoteKey] = useState<number>(0);
  const lastQuoteRef = useRef<ZenQuoteType | undefined>(undefined);
  const sound = useSoundContext();

  const handlePhaseChange = useCallback(
    (phase: PomodoroPhase) => {
      switch (phase) {
        case "focus":
          // Section 6.4 : début de focus → bol chantant (attaque douce)
          sound.play("singing-bowl-soft");
          break;
        case "short-break":
        case "long-break": {
          // Fin de focus / début de pause → cloche de temple + nouvelle citation
          sound.play("rin");
          const next = pickRandomQuote(lastQuoteRef.current);
          lastQuoteRef.current = next;
          setQuote(next);
          setQuoteKey((k) => k + 1);
          break;
        }
        case "idle":
          setQuote(null);
          lastQuoteRef.current = undefined;
          break;
        default:
          break;
      }
    },
    [sound]
  );

  const timer = usePomodoroTimer({ settings, onPhaseChange: handlePhaseChange });
  const sessionActive = timer.phase !== "idle";

  // Avant le démarrage, on affiche la durée prévue du focus (évite "00:00" déroutant)
  const displaySeconds =
    timer.phase === "idle" ? settings.focusMinutes * 60 : timer.secondsLeft;

  const labelInfo = PHASE_LABEL[timer.phase];

  const isBreak =
    timer.phase === "short-break" || timer.phase === "long-break";
  const accent = isBreak
    ? "bg-sakura-500 hover:bg-sakura-700"
    : "bg-ai-500 hover:bg-ai-700";

  const labelColorClass = isBreak
    ? "text-sakura-700"
    : timer.phase === "focus"
    ? "text-ai-700"
    : "text-sumi-600";

  return (
    <div className="flex flex-col items-center gap-5 sm:gap-7 w-full">
      <CircleTimer
        progress={timer.phase === "idle" ? 0 : timer.phaseProgress}
        color={PHASE_COLOR[timer.phase]}
        size={360}
      >
        <TimerDisplay
          seconds={displaySeconds}
          label={`${labelInfo.fr} · ${labelInfo.jp}`}
          labelColorClass={labelColorClass}
        />
      </CircleTimer>

      <PomodoroCounter
        completed={timer.completedPomodoros}
        perCycle={timer.pomodorosBeforeLongBreak}
      />

      <TimerControls
        isRunning={timer.isRunning}
        isPaused={timer.isPaused}
        isComplete={false}
        onStart={timer.start}
        onPause={timer.pause}
        onResume={timer.resume}
        onReset={timer.reset}
        onSkip={timer.skipPhase}
        accentClass={accent}
      />

      {isBreak && quote && <ZenQuote quote={quote} reanimateKey={quoteKey} />}

      <details className="w-full max-w-md group" open={!sessionActive}>
        <summary className="cursor-pointer text-xs text-sumi-500 hover:text-sumi-800 transition-colors py-1 select-none">
          Paramètres {sessionActive && "(verrouillés en séance)"}
        </summary>
        <div className="mt-3">
          <PomodoroSettingsPanel
            value={settings}
            onChange={setSettings}
            disabled={sessionActive}
          />
        </div>
      </details>
    </div>
  );
}
