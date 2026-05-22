// app/components/audio/VolumeControl.tsx — Contrôle volume discret pour le Header.
// Bouton speaker (mute toggle) + popover avec slider au survol/clic. Mobile : tap pour ouvrir/fermer.
"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Volume1 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Slider } from "@/app/components/ui/slider";
import { useSoundContext } from "./SoundProvider";
import { cn } from "@/lib/utils";

export function VolumeControl() {
  const { volume, setVolume, isMuted, toggleMute } = useSoundContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ferme au clic en dehors
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const Icon = isMuted || volume === 0 ? VolumeX : volume < 0.4 ? Volume1 : Volume2;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          aria-label={isMuted ? "Réactiver le son" : "Couper le son"}
          aria-pressed={isMuted}
          className="h-9 w-9 text-sumi-600 hover:text-sumi-900"
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          aria-label="Régler le volume"
          aria-expanded={open}
          className="hidden sm:inline-flex h-9 px-2 text-xs text-sumi-500"
        >
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </Button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-label="Volume"
          className={cn(
            "absolute right-0 top-full mt-2 z-50 w-48 rounded-md border border-sumi-200 bg-washi p-3 shadow-lg shadow-sumi-200/40 animate-fade-in"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-sumi-600">Volume</span>
            <span className="text-xs font-mono tabular-nums text-sumi-900">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.05}
            onValueChange={([v]) => setVolume(v)}
          />
        </div>
      )}
    </div>
  );
}
