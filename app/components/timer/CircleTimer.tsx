// app/components/timer/CircleTimer.tsx — Cercle SVG animé, pièce iconique de Toki.
// L'anneau se remplit comme de l'encre qui coule (stroke-dasharray progressif).
// Couleur passée par prop pour s'adapter au contexte (shu = Sport effort, sakura = pause, ai = Pomodoro, matcha = Flow…).
"use client";

import { cn } from "@/lib/utils";

export type CircleTimerColor =
  | "shu" // vermillon — effort sport
  | "sakura" // rose — pauses
  | "ai" // indigo — focus pomodoro
  | "matcha" // vert thé — flow / Zen
  | "sumi"; // encre — idle / neutre

const COLOR_STROKE: Record<CircleTimerColor, string> = {
  shu: "stroke-shu-500",
  sakura: "stroke-sakura-500",
  ai: "stroke-ai-500",
  matcha: "stroke-matcha-500",
  sumi: "stroke-sumi-400",
};

const COLOR_TRACK: Record<CircleTimerColor, string> = {
  shu: "stroke-shu-50",
  sakura: "stroke-sakura-50",
  ai: "stroke-ai-50",
  matcha: "stroke-matcha-50",
  sumi: "stroke-sumi-100",
};

type CircleTimerProps = {
  /** Progression de 0 à 1. 0 = vide, 1 = plein. */
  progress: number;
  /** Couleur de l'anneau. */
  color?: CircleTimerColor;
  /** Mode "pulse" (mode Flow) — anime une respiration lente. */
  pulse?: boolean;
  /** Contenu central (TimerDisplay, label…). */
  children?: React.ReactNode;
  /** Taille en px du SVG (défaut 360, suffisamment grand pour laisser respirer le TimerDisplay). */
  size?: number;
  /** Épaisseur du trait. */
  strokeWidth?: number;
  className?: string;
};

export function CircleTimer({
  progress,
  color = "sumi",
  pulse = false,
  children,
  size = 360,
  strokeWidth = 14,
  className,
}: CircleTimerProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center max-w-full aspect-square",
        pulse && "animate-slow-pulse",
        className
      )}
      style={{
        width: size,
        // height implicite via aspect-square, garantit la contrainte sur mobile
        // Ombre chaude (sumi à très faible opacité, jamais grise) — sensation organique cf. §3.4
        filter: "drop-shadow(0 8px 24px rgba(61, 55, 47, 0.06))",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        {/* Track de fond */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn(COLOR_TRACK[color], "transition-colors duration-500")}
        />
        {/* Anneau de progression — l'encre qui coule */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={cn(
            COLOR_STROKE[color],
            "transition-[stroke-dashoffset,stroke] duration-300 ease-linear"
          )}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ padding: strokeWidth * 2.5 }}
      >
        {children}
      </div>
    </div>
  );
}
