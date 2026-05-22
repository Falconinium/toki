// app/components/audio/SoundProvider.tsx — Provider Context qui partage UNE seule instance de useSound
// entre tous les composants. Évite de recharger les buffers dans chaque consommateur.
"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSound, type UseSoundReturn } from "@/app/hooks/useSound";

const SoundContext = createContext<UseSoundReturn | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const value = useSound();
  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

/** Hook consommateur — throw si appelé en dehors du Provider (bug-friendly). */
export function useSoundContext(): UseSoundReturn {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error(
      "useSoundContext doit être utilisé à l'intérieur d'un <SoundProvider>"
    );
  }
  return ctx;
}
