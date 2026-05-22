// app/components/ui/stepper.tsx — Stepper numérique (− / valeur / +) avec bornes min/max.
// Utilisé partout dans les settings Sport et Pomodoro. Format optionnel (ex: "30s", "5 min").
"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

type StepperProps = {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  /** Pas par défaut 1. */
  step?: number;
  /** Format d'affichage. Défaut "<value>". */
  formatValue?: (v: number) => string;
  /** Désactivé (en cours de session, par exemple). */
  disabled?: boolean;
  /** Compact mode (settings denses). */
  compact?: boolean;
  className?: string;
};

export function Stepper({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue = (v) => String(v),
  disabled = false,
  compact = false,
  className,
}: StepperProps) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-md border border-sumi-200 bg-sumi-50/40 px-3 py-2",
        compact && "px-2 py-1.5",
        disabled && "opacity-60",
        className
      )}
    >
      <span className={cn("text-sumi-700", compact ? "text-xs" : "text-sm")}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={dec}
          disabled={disabled || value <= min}
          aria-label={`Diminuer ${label}`}
          className={cn(
            "rounded-full text-sumi-600 hover:text-sumi-900 active:scale-90 transition-transform",
            compact ? "h-7 w-7" : "h-8 w-8"
          )}
        >
          <Minus className="h-4 w-4" strokeWidth={1.75} />
        </Button>
        <span
          className={cn(
            "min-w-[3.5rem] text-center font-mono tabular-nums text-sumi-900",
            compact ? "text-sm" : "text-base"
          )}
        >
          {formatValue(value)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={inc}
          disabled={disabled || value >= max}
          aria-label={`Augmenter ${label}`}
          className={cn(
            "rounded-full text-sumi-600 hover:text-sumi-900 active:scale-90 transition-transform",
            compact ? "h-7 w-7" : "h-8 w-8"
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  );
}
