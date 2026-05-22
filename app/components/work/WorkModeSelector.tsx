// app/components/work/WorkModeSelector.tsx — Sélecteur Pomodoro (ポモドーロ) / Flow (流れ).
// Pills horizontales, l'actif a la couleur dominante (indigo pour Pomodoro, matcha pour Flow).
"use client";

import { cn } from "@/lib/utils";
import type { WorkMode } from "@/lib/types";

const MODES: Array<{
  id: WorkMode;
  label: string;
  jp: string;
  hint: string;
  activeClasses: string;
}> = [
  {
    id: "pomodoro",
    label: "Pomodoro",
    jp: "ポモドーロ",
    hint: "Focus / pause / focus",
    activeClasses: "border-ai-500 bg-ai-50 text-ai-700 shadow-sm shadow-ai-100",
  },
  {
    id: "flow",
    label: "Flow",
    jp: "流れ",
    hint: "Deep work, sans limite",
    activeClasses:
      "border-matcha-500 bg-matcha-50 text-matcha-700 shadow-sm shadow-matcha-100",
  },
];

type WorkModeSelectorProps = {
  value: WorkMode;
  onChange: (m: WorkMode) => void;
  disabled?: boolean;
  className?: string;
};

export function WorkModeSelector({
  value,
  onChange,
  disabled = false,
  className,
}: WorkModeSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Mode de travail"
      className={cn("grid grid-cols-2 gap-2 w-full max-w-md", className)}
    >
      {MODES.map((m) => {
        const active = m.id === value;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(m.id)}
            className={cn(
              "flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-washi",
              active
                ? m.activeClasses
                : "border-sumi-200 bg-sumi-50/40 text-sumi-700 hover:border-sumi-400",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span className="flex items-baseline gap-2">
              <span className="text-sm font-semibold leading-none">
                {m.label}
              </span>
              <span
                className={cn(
                  "font-serifJp text-[10px] leading-none",
                  active ? "opacity-80" : "text-sumi-400"
                )}
              >
                {m.jp}
              </span>
            </span>
            <span
              className={cn(
                "text-[10px] leading-none",
                active ? "opacity-70" : "text-sumi-400"
              )}
            >
              {m.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
