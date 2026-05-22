// app/components/timer/ProgressBar.tsx — Barre de progression globale (mini, en bas du timer).
// Utile pour visualiser l'avancée d'un cycle complet (ex: round 2/3 d'un Tabata, pomodoro 3/4).
"use client";

import { cn } from "@/lib/utils";

type ProgressBarProps = {
  /** Progression de 0 à 1. */
  value: number;
  /** Couleur tailwind du remplissage. Défaut sumi-400. */
  fillClass?: string;
  /** Label accessible. */
  label?: string;
  className?: string;
};

export function ProgressBar({
  value,
  fillClass = "bg-sumi-400",
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className={cn("w-full max-w-md", className)}>
      {label && (
        <div className="mb-1 text-xs text-sumi-600 tracking-wide">{label}</div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label={label}
        className="h-1.5 w-full rounded-full bg-sumi-100 overflow-hidden"
      >
        <div
          className={cn("h-full rounded-full transition-all duration-300", fillClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
