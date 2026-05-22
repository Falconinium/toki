// app/components/work/PomodoroCounter.tsx — Pierres de go : visualisation des pomodoros complétés dans le cycle courant.
// N cercles (N = pomodorosBeforeLongBreak), remplis indigo pour ceux complétés. Au-delà de N on affiche aussi le nombre de cycles complets.
"use client";

import { cn } from "@/lib/utils";

type PomodoroCounterProps = {
  completed: number;
  perCycle: number;
  className?: string;
};

export function PomodoroCounter({
  completed,
  perCycle,
  className,
}: PomodoroCounterProps) {
  const cyclesCompleted = Math.floor(completed / perCycle);
  const inCurrentCycle = completed % perCycle;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className="flex items-center gap-1.5"
        role="meter"
        aria-label={`Pomodoros complétés dans le cycle : ${inCurrentCycle} sur ${perCycle}`}
        aria-valuemin={0}
        aria-valuemax={perCycle}
        aria-valuenow={inCurrentCycle}
      >
        {Array.from({ length: perCycle }).map((_, i) => {
          const filled = i < inCurrentCycle;
          return (
            <span
              key={i}
              aria-hidden
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors duration-500",
                filled
                  ? "bg-ai-500 shadow-[inset_0_0_0_1px_var(--toki-ai-700)]"
                  : "bg-sumi-100 border border-sumi-200"
              )}
            />
          );
        })}
      </div>
      {cyclesCompleted > 0 && (
        <span className="text-[10px] text-sumi-500 tracking-wide">
          {cyclesCompleted} cycle{cyclesCompleted > 1 ? "s" : ""} complet
          {cyclesCompleted > 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
