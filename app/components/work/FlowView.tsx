// app/components/work/FlowView.tsx — Mode Flow (流れ — Nagare) : deep work, chronomètre qui compte vers le haut.
// Cercle matcha qui pulse comme une respiration lente. Toggle "pluie" (ambient-rain en loop). Rappel optionnel à durée définie.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleTimer } from "@/app/components/timer/CircleTimer";
import { TimerControls } from "@/app/components/timer/TimerControls";
import { TimerDisplay } from "@/app/components/timer/TimerDisplay";
import { Stepper } from "@/app/components/ui/stepper";
import { useTimer } from "@/app/hooks/useTimer";
import { useSoundContext } from "@/app/components/audio/SoundProvider";
import { CloudRain, Bell, BellOff } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

export function FlowView() {
  const sound = useSoundContext();
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  const [reminderMinutes, setReminderMinutes] = useState<number>(45);
  const [rainOn, setRainOn] = useState<boolean>(false);
  const reminderFiredRef = useRef<boolean>(false);

  // Countup pur, sans limite. La progression circulaire reste à 0 (le cercle pulse simplement).
  const timer = useTimer({ direction: "countup" });

  const handleStart = useCallback(() => {
    reminderFiredRef.current = false;
    timer.start();
    sound.play("singing-bowl-soft");
  }, [timer, sound]);

  // Rappel : déclenché une fois quand on atteint reminderMinutes
  useEffect(() => {
    if (
      reminderEnabled &&
      timer.isRunning &&
      !reminderFiredRef.current &&
      timer.fractionalSeconds >= reminderMinutes * 60
    ) {
      reminderFiredRef.current = true;
      sound.play("singing-bowl");
    }
  }, [timer.fractionalSeconds, timer.isRunning, reminderEnabled, reminderMinutes, sound]);

  // Pluie d'ambiance : play/stop en loop selon le toggle. Stop quand on quitte le mode/composant.
  useEffect(() => {
    if (rainOn) {
      sound.play("ambient-rain", { loop: true });
    } else {
      sound.stop("ambient-rain");
    }
  }, [rainOn, sound]);

  useEffect(() => {
    return () => {
      sound.stop("ambient-rain");
    };
  }, [sound]);

  const isActive = timer.isRunning || timer.isPaused;

  return (
    <div className="flex flex-col items-center gap-5 sm:gap-7 w-full">
      <CircleTimer
        progress={0}
        color="matcha"
        pulse={timer.isRunning}
        size={360}
      >
        <TimerDisplay
          seconds={timer.seconds}
          label="流れ · Nagare"
          labelColorClass="text-matcha-700"
        />
      </CircleTimer>

      <TimerControls
        isRunning={timer.isRunning}
        isPaused={timer.isPaused}
        isComplete={false}
        onStart={handleStart}
        onPause={timer.pause}
        onResume={timer.resume}
        onReset={() => {
          reminderFiredRef.current = false;
          timer.reset(0);
        }}
        accentClass="bg-matcha-500 hover:bg-matcha-700"
        hideSkip
      />

      {/* Toggles ambiance + rappel */}
      <div className="w-full max-w-md flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setRainOn((v) => !v)}
          aria-pressed={rainOn}
          className={cn(
            "gap-2 transition-colors duration-300",
            rainOn
              ? "border-matcha-500 bg-matcha-50 text-matcha-700"
              : "text-sumi-600"
          )}
        >
          <CloudRain className="h-4 w-4" strokeWidth={1.5} />
          Pluie {rainOn ? "活" : "—"}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setReminderEnabled((v) => !v)}
          aria-pressed={reminderEnabled}
          className={cn(
            "gap-2 transition-colors duration-300",
            reminderEnabled
              ? "border-matcha-500 bg-matcha-50 text-matcha-700"
              : "text-sumi-600"
          )}
        >
          {reminderEnabled ? (
            <Bell className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <BellOff className="h-4 w-4" strokeWidth={1.5} />
          )}
          Rappel
        </Button>
      </div>

      {reminderEnabled && (
        <div className="w-full max-w-xs animate-fade-in">
          <Stepper
            label="Me rappeler dans"
            value={reminderMinutes}
            onChange={setReminderMinutes}
            min={5}
            max={180}
            step={5}
            formatValue={(n) => `${n} min`}
            disabled={isActive}
            compact
          />
        </div>
      )}

      <p className="max-w-md text-xs text-sumi-400">
        Mode deep work — le temps coule sans interruption.
      </p>
    </div>
  );
}
