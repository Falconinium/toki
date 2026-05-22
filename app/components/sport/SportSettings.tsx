// app/components/sport/SportSettings.tsx — Panneau de paramètres Sport.
// Steppers affichés conditionnellement selon le mode (ex: EMOM cache rest, AMRAP cache sets/repos).
"use client";

import { Stepper } from "@/app/components/ui/stepper";
import { SPORT_LIMITS } from "@/lib/constants";
import type { SportMode, SportSettings } from "@/lib/types";

type SportSettingsPanelProps = {
  mode: SportMode;
  value: SportSettings;
  onChange: (next: SportSettings) => void;
  disabled?: boolean;
};

function fmtSeconds(s: number): string {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r === 0 ? `${m}min` : `${m}min ${r}s`;
}

function stepFor(seconds: number): number {
  // Steppers granulaires en bas, plus large en haut
  if (seconds < 60) return 5;
  if (seconds < 5 * 60) return 15;
  return 30;
}

export function SportSettingsPanel({
  mode,
  value,
  onChange,
  disabled = false,
}: SportSettingsPanelProps) {
  const patch = (partial: Partial<SportSettings>) =>
    onChange({ ...value, ...partial });

  // Steppers affichés selon le mode
  const showEffort = true;
  const showRest = mode === "tabata" || mode === "custom";
  const showSets = mode === "tabata" || mode === "emom" || mode === "custom";
  const showRounds = mode === "tabata" || mode === "custom";
  const showRoundRest =
    (mode === "tabata" || mode === "custom") && value.rounds > 1;

  const effortLabel =
    mode === "amrap" ? "Durée totale" : mode === "emom" ? "Intervalle" : "Effort";

  return (
    <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-2">
      {showEffort && (
        <Stepper
          label={effortLabel}
          value={value.effortSeconds}
          onChange={(n) => patch({ effortSeconds: n })}
          min={SPORT_LIMITS.effortSeconds.min}
          max={SPORT_LIMITS.effortSeconds.max}
          step={stepFor(value.effortSeconds)}
          formatValue={fmtSeconds}
          disabled={disabled}
          compact
        />
      )}
      {showRest && (
        <Stepper
          label="Repos"
          value={value.restSeconds}
          onChange={(n) => patch({ restSeconds: n })}
          min={SPORT_LIMITS.restSeconds.min}
          max={SPORT_LIMITS.restSeconds.max}
          step={5}
          formatValue={fmtSeconds}
          disabled={disabled}
          compact
        />
      )}
      {showSets && (
        <Stepper
          label={mode === "emom" ? "Minutes" : "Séries"}
          value={value.sets}
          onChange={(n) => patch({ sets: n })}
          min={SPORT_LIMITS.sets.min}
          max={SPORT_LIMITS.sets.max}
          step={1}
          disabled={disabled}
          compact
        />
      )}
      {showRounds && (
        <Stepper
          label="Rounds"
          value={value.rounds}
          onChange={(n) => patch({ rounds: n })}
          min={SPORT_LIMITS.rounds.min}
          max={SPORT_LIMITS.rounds.max}
          step={1}
          disabled={disabled}
          compact
        />
      )}
      {showRoundRest && (
        <Stepper
          label="Repos entre rounds"
          value={value.restBetweenRoundsSeconds}
          onChange={(n) => patch({ restBetweenRoundsSeconds: n })}
          min={SPORT_LIMITS.restBetweenRoundsSeconds.min}
          max={SPORT_LIMITS.restBetweenRoundsSeconds.max}
          step={15}
          formatValue={fmtSeconds}
          disabled={disabled}
          compact
        />
      )}
      <Stepper
        label="Compte à rebours"
        value={value.startCountdownEnabled ? value.startCountdownSeconds : 0}
        onChange={(n) =>
          patch({
            startCountdownEnabled: n > 0,
            startCountdownSeconds:
              n > 0 ? Math.max(SPORT_LIMITS.startCountdownSeconds.min, n) : 0,
          })
        }
        min={0}
        max={SPORT_LIMITS.startCountdownSeconds.max}
        step={1}
        formatValue={(n) => (n === 0 ? "Off" : `${n}s`)}
        disabled={disabled}
        compact
      />
    </div>
  );
}
