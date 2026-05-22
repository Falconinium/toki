// lib/constants.ts — Valeurs par défaut, limites et constantes globales pour les timers Sport et Travail.
import type { PomodoroSettings, SportSettings } from "./types";

// === Sport — défauts par mode (section 5.1/5.2 du CLAUDE.md) ===
export const SPORT_DEFAULTS: Record<string, SportSettings> = {
  tabata: {
    effortSeconds: 20,
    restSeconds: 10,
    sets: 8,
    rounds: 1,
    restBetweenRoundsSeconds: 60,
    startCountdownEnabled: true,
    startCountdownSeconds: 5,
  },
  emom: {
    effortSeconds: 60,
    restSeconds: 0,
    sets: 10,
    rounds: 1,
    restBetweenRoundsSeconds: 0,
    startCountdownEnabled: true,
    startCountdownSeconds: 5,
  },
  amrap: {
    effortSeconds: 12 * 60,
    restSeconds: 0,
    sets: 1,
    rounds: 1,
    restBetweenRoundsSeconds: 0,
    startCountdownEnabled: true,
    startCountdownSeconds: 5,
  },
  custom: {
    effortSeconds: 30,
    restSeconds: 15,
    sets: 8,
    rounds: 3,
    restBetweenRoundsSeconds: 60,
    startCountdownEnabled: true,
    startCountdownSeconds: 5,
  },
};

// Bornes des steppers Sport
export const SPORT_LIMITS = {
  effortSeconds: { min: 5, max: 60 * 60 },
  restSeconds: { min: 0, max: 60 * 10 },
  sets: { min: 1, max: 99 },
  rounds: { min: 1, max: 20 },
  restBetweenRoundsSeconds: { min: 0, max: 60 * 10 },
  startCountdownSeconds: { min: 3, max: 10 },
} as const;

// === Pomodoro — défauts classiques (section 6.1) ===
export const POMODORO_DEFAULTS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  pomodorosBeforeLongBreak: 4,
};

export const POMODORO_LIMITS = {
  focusMinutes: { min: 5, max: 90 },
  shortBreakMinutes: { min: 1, max: 15 },
  longBreakMinutes: { min: 5, max: 30 },
  pomodorosBeforeLongBreak: { min: 2, max: 8 },
} as const;

// === Timer — précision de la boucle d'horloge ===
// On utilise un intervalle de 100ms pour une animation fluide du cercle SVG
// tout en gardant un compteur en secondes (drift compensé par horodatage).
export const TIMER_TICK_MS = 100;
