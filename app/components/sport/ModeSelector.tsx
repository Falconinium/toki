// app/components/sport/ModeSelector.tsx — Sélecteur des 4 modes Sport (Tabata/EMOM/AMRAP/Custom).
// Pills horizontales, l'actif a la couleur vermillon. Désactivé pendant une session active.
"use client";

import { cn } from "@/lib/utils";
import type { SportMode } from "@/lib/types";

const MODES: Array<{ id: SportMode; label: string; hint: string }> = [
  { id: "tabata", label: "Tabata", hint: "20s / 10s × 8" },
  { id: "emom", label: "EMOM", hint: "Chaque minute" },
  { id: "amrap", label: "AMRAP", hint: "Durée fixe" },
  { id: "custom", label: "Custom", hint: "Sur mesure" },
];

type ModeSelectorProps = {
  value: SportMode;
  onChange: (m: SportMode) => void;
  disabled?: boolean;
  className?: string;
};

export function ModeSelector({
  value,
  onChange,
  disabled = false,
  className,
}: ModeSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Mode d'entraînement"
      className={cn("grid grid-cols-2 sm:grid-cols-4 gap-2 w-full", className)}
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
                ? "border-shu-500 bg-shu-50 text-shu-700 shadow-sm shadow-shu-100"
                : "border-sumi-200 bg-sumi-50/40 text-sumi-700 hover:border-shu-300 hover:bg-shu-50/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span className="text-sm font-semibold leading-none">{m.label}</span>
            <span
              className={cn(
                "text-[10px] leading-none",
                active ? "text-shu-500" : "text-sumi-400"
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
