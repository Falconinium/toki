// app/components/work/ZenQuote.tsx — Affiche une citation zen (kanji + romaji + traduction française).
// Animation fade-in-up douce sur fond washi, alignement centré, typographie aérée.
"use client";

import { cn } from "@/lib/utils";
import type { ZenQuote as ZenQuoteType } from "@/lib/types";

type ZenQuoteProps = {
  quote: ZenQuoteType;
  /** Clé pour forcer le re-mount et re-déclencher l'animation à chaque changement. */
  reanimateKey?: string | number;
  className?: string;
};

export function ZenQuote({ quote, reanimateKey, className }: ZenQuoteProps) {
  return (
    <figure
      key={reanimateKey}
      className={cn(
        "flex flex-col items-center text-center gap-2 max-w-md px-4 py-5 rounded-md bg-sumi-50/60 border border-sumi-100 animate-fade-in-up",
        className
      )}
      aria-label="Citation zen"
    >
      <p className="font-serifJp text-3xl sm:text-4xl text-sumi-900 leading-tight">
        {quote.kanji}
      </p>
      <p className="text-sm italic text-sumi-600 tracking-wide">
        {quote.romaji}
      </p>
      <figcaption className="text-sm text-sumi-700 leading-snug">
        {quote.french}
      </figcaption>
    </figure>
  );
}
