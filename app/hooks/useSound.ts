// app/hooks/useSound.ts — Hook bas-niveau Web Audio API.
// Précharge les fichiers audio en AudioBuffer, joue à la demande avec contrôle de volume,
// gère le déverrouillage iOS/Safari (AudioContext suspendu au démarrage).
// Utilisé via SoundProvider plutôt que directement par les composants.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SoundName } from "@/lib/types";

// Source unique de vérité : nom logique → chemin /public.
// Les fichiers doivent être déposés dans public/sounds/ (cf. public/sounds/README.md).
export const SOUND_FILES: Record<SoundName, string> = {
  "taiko-light": "/sounds/taiko-light.mp3",
  "taiko-strong": "/sounds/taiko-strong.mp3",
  rin: "/sounds/rin.mp3",
  "singing-bowl": "/sounds/singing-bowl.mp3",
  "singing-bowl-soft": "/sounds/singing-bowl-soft.mp3",
  "ambient-rain": "/sounds/ambient-rain.mp3",
};

export type UseSoundReturn = {
  /** Joue un son. No-op si muet, si volume = 0, ou si l'audio n'est pas prêt. */
  play: (name: SoundName, options?: { loop?: boolean }) => void;
  /** Arrête une source actuellement jouée (utile pour ambient-rain en loop). */
  stop: (name: SoundName) => void;
  /** Volume global 0..1. */
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (m: boolean) => void;
  /** True une fois que tous les sons sont chargés (ou en échec gracieux). */
  isReady: boolean;
  /** Sons qui n'ont pas pu être chargés (fichier manquant, format invalide). */
  failedSounds: SoundName[];
};

export function useSound(): UseSoundReturn {
  const [volume, setVolumeState] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [failedSounds, setFailedSounds] = useState<SoundName[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const buffersRef = useRef<Partial<Record<SoundName, AudioBuffer>>>({});
  // Sources actives indexées par nom (pour pouvoir stopper un loop)
  const activeSourcesRef = useRef<Partial<Record<SoundName, AudioBufferSourceNode>>>({});

  // Lazy-init AudioContext (Safari suspend tant qu'il n'y a pas de geste utilisateur)
  const ensureContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (audioCtxRef.current) return audioCtxRef.current;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor();
    const gain = ctx.createGain();
    gain.gain.value = isMuted ? 0 : volume;
    gain.connect(ctx.destination);
    audioCtxRef.current = ctx;
    gainNodeRef.current = gain;
    return ctx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Préchargement des buffers au montage
  useEffect(() => {
    let cancelled = false;
    const ctx = ensureContext();
    if (!ctx) {
      setIsReady(true); // pas d'audio dispo (SSR / vieux navigateur) — on n'attend pas
      return;
    }

    (async () => {
      const failed: SoundName[] = [];
      await Promise.all(
        (Object.keys(SOUND_FILES) as SoundName[]).map(async (name) => {
          try {
            const res = await fetch(SOUND_FILES[name]);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const arr = await res.arrayBuffer();
            const buf = await ctx.decodeAudioData(arr);
            if (!cancelled) buffersRef.current[name] = buf;
          } catch {
            failed.push(name);
          }
        })
      );
      if (!cancelled) {
        setFailedSounds(failed);
        setIsReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ensureContext]);

  // Sync gain node sur volume / mute
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (clamped > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);
  const setMuted = useCallback((m: boolean) => setIsMuted(m), []);

  const play = useCallback(
    (name: SoundName, options?: { loop?: boolean }) => {
      const ctx = ensureContext();
      const gain = gainNodeRef.current;
      const buf = buffersRef.current[name];
      if (!ctx || !gain || !buf || isMuted || volume === 0) return;

      // Déverrouille le contexte si suspendu (premier geste utilisateur)
      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      // Stoppe la source précédente du même nom (utile pour loops uniques)
      const previous = activeSourcesRef.current[name];
      if (previous) {
        try {
          previous.stop();
        } catch {
          /* déjà arrêté */
        }
        delete activeSourcesRef.current[name];
      }

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = options?.loop ?? false;
      src.connect(gain);
      src.start(0);
      activeSourcesRef.current[name] = src;
      src.onended = () => {
        if (activeSourcesRef.current[name] === src) {
          delete activeSourcesRef.current[name];
        }
      };
    },
    [ensureContext, isMuted, volume]
  );

  const stop = useCallback((name: SoundName) => {
    const src = activeSourcesRef.current[name];
    if (!src) return;
    try {
      src.stop();
    } catch {
      /* déjà arrêté */
    }
    delete activeSourcesRef.current[name];
  }, []);

  // Cleanup AudioContext au démontage final
  useEffect(() => {
    return () => {
      Object.values(activeSourcesRef.current).forEach((s) => {
        try {
          s?.stop();
        } catch {
          /* noop */
        }
      });
      activeSourcesRef.current = {};
      // On ne close pas le ctx : il peut être réutilisé entre HMR.
    };
  }, []);

  return {
    play,
    stop,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    setMuted,
    isReady,
    failedSounds,
  };
}
