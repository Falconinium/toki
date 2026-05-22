// app/components/sport/SportView.tsx — Vue Sport (スポーツ) — orchestration complète Phase 3.
// Mode (Tabata/EMOM/AMRAP/Custom) + settings + useSportTimer + CircleTimer + SetCounter.
"use client";

import { useCallback, useMemo, useState } from "react";
import { CircleTimer, type CircleTimerColor } from "@/app/components/timer/CircleTimer";
import { ProgressBar } from "@/app/components/timer/ProgressBar";
import { TimerControls } from "@/app/components/timer/TimerControls";
import { TimerDisplay } from "@/app/components/timer/TimerDisplay";
import { ModeSelector } from "./ModeSelector";
import { SportSettingsPanel } from "./SportSettings";
import { SetCounter } from "./SetCounter";
import { useSportTimer } from "@/app/hooks/useSportTimer";
import { useSoundContext } from "@/app/components/audio/SoundProvider";
import { SPORT_DEFAULTS } from "@/lib/constants";
import type { SportMode, SportSettings, SportPhase } from "@/lib/types";

const PHASE_LABEL: Record<string, string> = {
  idle: "Prêt",
  countdown: "Préparation",
  effort: "Effort",
  rest: "Repos",
  "round-rest": "Repos entre rounds",
  done: "Terminé",
};

const PHASE_COLOR: Record<string, CircleTimerColor> = {
  idle: "sumi",
  countdown: "sumi",
  effort: "shu",
  rest: "sakura",
  "round-rest": "sakura",
  done: "sumi",
};

export function SportView() {
  const [mode, setMode] = useState<SportMode>("tabata");
  const [settingsByMode, setSettingsByMode] = useState<
    Record<SportMode, SportSettings>
  >(() => ({
    tabata: SPORT_DEFAULTS.tabata,
    emom: SPORT_DEFAULTS.emom,
    amrap: SPORT_DEFAULTS.amrap,
    custom: SPORT_DEFAULTS.custom,
  }));

  const settings = settingsByMode[mode];
  const setSettings = (next: SportSettings) =>
    setSettingsByMode((all) => ({ ...all, [mode]: next }));

  const sound = useSoundContext();

  // Sons branchés sur les transitions (section 5.4 du CLAUDE.md)
  const handlePhaseChange = useCallback(
    (phase: SportPhase) => {
      switch (phase) {
        case "effort":
          sound.play("taiko-strong");
          break;
        case "rest":
        case "round-rest":
          sound.play("rin");
          break;
        case "done":
          sound.play("singing-bowl");
          break;
        default:
          break;
      }
    },
    [sound]
  );

  const handleLastSecondTick = useCallback(
    (secondsLeft: number) => {
      // Rappel doux sur les 3 dernières secondes d'un effort/repos
      if (secondsLeft > 0 && secondsLeft <= 3) {
        sound.play("taiko-light");
      }
    },
    [sound]
  );

  const timer = useSportTimer({
    settings,
    onPhaseChange: handlePhaseChange,
    onLastSecondTick: handleLastSecondTick,
  });
  const sessionActive =
    timer.phase !== "idle" && timer.phase !== "done";

  const accent = useMemo(() => {
    // Bouton play : vermillon (effort) ou indigo de la palette neutre par défaut.
    if (timer.phase === "rest" || timer.phase === "round-rest") {
      return "bg-sakura-500 hover:bg-sakura-700";
    }
    return "bg-shu-500 hover:bg-shu-700";
  }, [timer.phase]);

  const hideSets = mode === "amrap";
  const hideRounds = settings.rounds <= 1;

  const labelColorClass =
    timer.phase === "rest" || timer.phase === "round-rest"
      ? "text-sakura-700"
      : timer.phase === "effort"
      ? "text-shu-700"
      : "text-sumi-600";

  const displaySeconds =
    timer.phase === "idle"
      ? mode === "amrap"
        ? settings.effortSeconds
        : settings.effortSeconds
      : timer.secondsLeft;

  const phaseLabel =
    timer.phase === "countdown"
      ? `Préparation · ${timer.secondsLeft}`
      : PHASE_LABEL[timer.phase];

  return (
    <section
      id="panel-sport"
      role="tabpanel"
      aria-labelledby="tab-sport"
      className="flex flex-col items-center text-center gap-5 sm:gap-7 py-4 sm:py-8 animate-fade-in"
    >
      <div className="flex flex-col items-center gap-0.5">
        <p className="font-serifJp text-xl text-shu-500 leading-none">スポーツ</p>
        <h1 className="font-display text-2xl sm:text-3xl text-sumi-900">Sport</h1>
      </div>

      <ModeSelector value={mode} onChange={setMode} disabled={sessionActive} />

      <CircleTimer
        progress={timer.phase === "idle" ? 0 : timer.phaseProgress}
        color={PHASE_COLOR[timer.phase]}
        size={360}
      >
        <TimerDisplay
          seconds={displaySeconds}
          label={phaseLabel}
          labelColorClass={labelColorClass}
        />
      </CircleTimer>

      <SetCounter
        currentSet={timer.currentSet}
        totalSets={timer.totalSets}
        currentRound={timer.currentRound}
        totalRounds={timer.totalRounds}
        hideSets={hideSets}
        hideRounds={hideRounds}
      />

      <TimerControls
        isRunning={timer.isRunning}
        isPaused={timer.isPaused}
        isComplete={timer.isDone}
        onStart={timer.start}
        onPause={timer.pause}
        onResume={timer.resume}
        onReset={timer.reset}
        onSkip={timer.skipPhase}
        accentClass={accent}
      />

      <ProgressBar
        value={timer.globalProgress}
        fillClass={
          timer.phase === "rest" || timer.phase === "round-rest"
            ? "bg-sakura-300"
            : "bg-shu-300"
        }
      />

      <div className="w-full flex flex-col items-center gap-2">
        <details
          className="w-full max-w-md group"
          open={!sessionActive}
        >
          <summary className="cursor-pointer text-xs text-sumi-500 hover:text-sumi-800 transition-colors py-1 select-none">
            Paramètres {sessionActive && "(verrouillés en séance)"}
          </summary>
          <div className="mt-3">
            <SportSettingsPanel
              mode={mode}
              value={settings}
              onChange={setSettings}
              disabled={sessionActive}
            />
          </div>
        </details>
      </div>
    </section>
  );
}
