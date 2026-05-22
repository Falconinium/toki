// app/components/timer/TimerControls.tsx — Boutons Play / Pause / Reset / Skip.
// Gros boutons tapables (min 48px), icônes Lucide stroke 1.5, accent contextuel via prop accentClass.
"use client";

import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

type TimerControlsProps = {
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  /** Visible si le timer n'a jamais démarré ou est terminé. */
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip?: () => void;
  /** Classe tailwind pour le bouton principal (ex: "bg-shu-500 hover:bg-shu-700"). */
  accentClass?: string;
  /** Cacher le bouton skip (mode Flow par ex.). */
  hideSkip?: boolean;
  className?: string;
};

export function TimerControls({
  isRunning,
  isPaused,
  isComplete,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
  accentClass = "bg-primary hover:bg-ai-700",
  hideSkip = false,
  className,
}: TimerControlsProps) {
  const showResume = isPaused && !isComplete;
  const showStart = !isRunning && !isPaused;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 sm:gap-4",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onReset}
        aria-label="Réinitialiser"
        className="text-sumi-600 hover:text-sumi-900"
      >
        <RotateCcw className="h-5 w-5" strokeWidth={1.5} />
      </Button>

      {showStart ? (
        <Button
          type="button"
          size="lg"
          onClick={onStart}
          aria-label="Démarrer"
          className={cn(
            "h-16 w-16 sm:h-20 sm:w-20 rounded-full p-0 text-washi shadow-lg shadow-sumi-200/40 transition-transform hover:scale-105",
            accentClass
          )}
        >
          <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-current" strokeWidth={1.5} />
        </Button>
      ) : showResume ? (
        <Button
          type="button"
          size="lg"
          onClick={onResume}
          aria-label="Reprendre"
          className={cn(
            "h-16 w-16 sm:h-20 sm:w-20 rounded-full p-0 text-washi shadow-lg shadow-sumi-200/40 transition-transform hover:scale-105",
            accentClass
          )}
        >
          <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-current" strokeWidth={1.5} />
        </Button>
      ) : (
        <Button
          type="button"
          size="lg"
          onClick={onPause}
          aria-label="Pause"
          className={cn(
            "h-16 w-16 sm:h-20 sm:w-20 rounded-full p-0 text-washi shadow-lg shadow-sumi-200/40 transition-transform hover:scale-105",
            accentClass
          )}
        >
          <Pause className="h-7 w-7 sm:h-8 sm:w-8 fill-current" strokeWidth={1.5} />
        </Button>
      )}

      {!hideSkip && onSkip ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onSkip}
          aria-label="Passer"
          disabled={!isRunning && !isPaused}
          className="text-sumi-600 hover:text-sumi-900"
        >
          <SkipForward className="h-5 w-5" strokeWidth={1.5} />
        </Button>
      ) : (
        // Garde l'équilibre visuel autour du bouton central
        <span className="h-12 w-12" aria-hidden />
      )}
    </div>
  );
}
