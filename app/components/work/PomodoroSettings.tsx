// app/components/work/PomodoroSettings.tsx — Steppers Pomodoro : focus / pause courte / pause longue / pomodoros avant pause longue.
"use client";

import { Stepper } from "@/app/components/ui/stepper";
import { POMODORO_LIMITS } from "@/lib/constants";
import type { PomodoroSettings } from "@/lib/types";

type PomodoroSettingsPanelProps = {
  value: PomodoroSettings;
  onChange: (next: PomodoroSettings) => void;
  disabled?: boolean;
};

const fmtMin = (n: number) => `${n} min`;

export function PomodoroSettingsPanel({
  value,
  onChange,
  disabled = false,
}: PomodoroSettingsPanelProps) {
  const patch = (partial: Partial<PomodoroSettings>) =>
    onChange({ ...value, ...partial });

  return (
    <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-2">
      <Stepper
        label="Focus"
        value={value.focusMinutes}
        onChange={(n) => patch({ focusMinutes: n })}
        min={POMODORO_LIMITS.focusMinutes.min}
        max={POMODORO_LIMITS.focusMinutes.max}
        step={5}
        formatValue={fmtMin}
        disabled={disabled}
        compact
      />
      <Stepper
        label="Pause courte"
        value={value.shortBreakMinutes}
        onChange={(n) => patch({ shortBreakMinutes: n })}
        min={POMODORO_LIMITS.shortBreakMinutes.min}
        max={POMODORO_LIMITS.shortBreakMinutes.max}
        step={1}
        formatValue={fmtMin}
        disabled={disabled}
        compact
      />
      <Stepper
        label="Pause longue"
        value={value.longBreakMinutes}
        onChange={(n) => patch({ longBreakMinutes: n })}
        min={POMODORO_LIMITS.longBreakMinutes.min}
        max={POMODORO_LIMITS.longBreakMinutes.max}
        step={5}
        formatValue={fmtMin}
        disabled={disabled}
        compact
      />
      <Stepper
        label="Avant pause longue"
        value={value.pomodorosBeforeLongBreak}
        onChange={(n) => patch({ pomodorosBeforeLongBreak: n })}
        min={POMODORO_LIMITS.pomodorosBeforeLongBreak.min}
        max={POMODORO_LIMITS.pomodorosBeforeLongBreak.max}
        step={1}
        disabled={disabled}
        compact
      />
    </div>
  );
}
