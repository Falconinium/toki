// app/components/timer/TimerDisplay.tsx — Chiffres du timer en gros, font mono (Space Mono).
// Format mm:ss par défaut, ou h:mm:ss au-delà de 1h. Variant pour countup long.
"use client";

import { cn } from "@/lib/utils";

type TimerDisplayProps = {
  seconds: number;
  /** Label optionnel sous les chiffres (ex: "EFFORT", "REPOS", "集中"). */
  label?: string;
  /** Couleur tailwind (text-*). Défaut sumi-900. */
  labelColorClass?: string;
  /** Taille des chiffres. */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_DIGIT: Record<NonNullable<TimerDisplayProps["size"]>, string> = {
  sm: "text-3xl sm:text-4xl",
  md: "text-5xl sm:text-6xl",
  lg: "text-6xl sm:text-7xl md:text-8xl",
};

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export function TimerDisplay({
  seconds,
  label,
  labelColorClass = "text-sumi-600",
  size = "lg",
  className,
}: TimerDisplayProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center select-none",
        className
      )}
    >
      <span
        className={cn(
          "font-mono font-bold leading-none tabular-nums text-sumi-900",
          SIZE_DIGIT[size]
        )}
        aria-live="polite"
      >
        {formatTime(seconds)}
      </span>
      {label && (
        <span
          className={cn(
            "mt-2 text-xs sm:text-sm tracking-[0.2em] uppercase",
            labelColorClass
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
