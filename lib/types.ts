// lib/types.ts — Types TypeScript partagés pour toute l'application Toki

export type ActiveTab = "sport" | "work";

// === Sport ===
export type SportMode = "tabata" | "emom" | "amrap" | "custom";

export type SportSettings = {
  effortSeconds: number;
  restSeconds: number;
  sets: number;
  rounds: number;
  restBetweenRoundsSeconds: number;
  startCountdownEnabled: boolean;
  startCountdownSeconds: number;
};

export type SportPhase = "idle" | "countdown" | "effort" | "rest" | "round-rest" | "done";

// === Work ===
export type WorkMode = "pomodoro" | "flow";

export type PomodoroSettings = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  pomodorosBeforeLongBreak: number;
};

export type PomodoroPhase = "idle" | "focus" | "short-break" | "long-break" | "done";

export type PomodoroState = {
  phase: PomodoroPhase;
  completedPomodoros: number;
};

// === Timer générique ===
export type TimerState = {
  isRunning: boolean;
  isPaused: boolean;
  // Pour countdown : remainingSeconds. Pour countup : elapsedSeconds.
  seconds: number;
  totalSeconds: number;
};

// === Audio ===
export type SoundName =
  | "taiko-light"
  | "taiko-strong"
  | "rin"
  | "singing-bowl"
  | "singing-bowl-soft"
  | "ambient-rain";

// === Citations zen ===
export type ZenQuote = {
  kanji: string;
  romaji: string;
  french: string;
};
