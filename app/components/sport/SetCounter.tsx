// app/components/sport/SetCounter.tsx — Affiche "Série X/Y" et "Round A/B" pendant la séance.
// Caché en mode AMRAP (1 seul "set" qui est la session entière).
"use client";

import { cn } from "@/lib/utils";

type SetCounterProps = {
  currentSet: number;
  totalSets: number;
  currentRound: number;
  totalRounds: number;
  /** Cache l'affichage des séries (mode AMRAP). */
  hideSets?: boolean;
  /** Cache l'affichage des rounds (1 seul round). */
  hideRounds?: boolean;
  className?: string;
};

export function SetCounter({
  currentSet,
  totalSets,
  currentRound,
  totalRounds,
  hideSets = false,
  hideRounds = false,
  className,
}: SetCounterProps) {
  if (hideSets && hideRounds) return null;
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 text-sumi-700",
        className
      )}
    >
      {!hideSets && (
        <span className="text-sm">
          Série{" "}
          <span className="font-mono font-semibold text-sumi-900">
            {currentSet}/{totalSets}
          </span>
        </span>
      )}
      {!hideSets && !hideRounds && (
        <span aria-hidden className="text-sumi-300">
          ·
        </span>
      )}
      {!hideRounds && (
        <span className="text-sm">
          Round{" "}
          <span className="font-mono font-semibold text-sumi-900">
            {currentRound}/{totalRounds}
          </span>
        </span>
      )}
    </div>
  );
}
