// app/components/work/WorkView.tsx — Vue Travail (仕事). Orchestration Phase 5.
// Sélecteur Pomodoro (ポモドーロ) / Flow (流れ) puis route vers la vue correspondante.
"use client";

import { useState } from "react";
import { WorkModeSelector } from "./WorkModeSelector";
import { PomodoroView } from "./PomodoroView";
import { FlowView } from "./FlowView";
import type { WorkMode } from "@/lib/types";

export function WorkView() {
  const [mode, setMode] = useState<WorkMode>("pomodoro");

  return (
    <section
      id="panel-work"
      role="tabpanel"
      aria-labelledby="tab-work"
      className="flex flex-col items-center text-center gap-5 sm:gap-7 py-4 sm:py-8 animate-fade-in"
    >
      <div className="flex flex-col items-center gap-0.5">
        <p className="font-serifJp text-xl text-ai-500 leading-none">仕事</p>
        <h1 className="font-display text-2xl sm:text-3xl text-sumi-900">
          Travail
        </h1>
      </div>

      <WorkModeSelector value={mode} onChange={setMode} />

      {mode === "pomodoro" ? <PomodoroView /> : <FlowView />}
    </section>
  );
}
