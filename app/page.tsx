// app/page.tsx — Page unique de Toki. State central (onglet actif) en useState. La structure complète (useReducer pour timers, etc.) sera enrichie aux phases suivantes.
"use client";

import { useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { SportView } from "@/app/components/sport/SportView";
import { WorkView } from "@/app/components/work/WorkView";
import type { ActiveTab } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("sport");

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Voile de teinte selon l'onglet : plus chaud pour Sport (shu), plus froid pour Travail (ai).
          Le fond washi reste dominant — c'est un léger lavis, pas une couleur dominante. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 transition-colors duration-700 ease-out",
          activeTab === "sport" ? "bg-shu-50/35" : "bg-ai-50/35"
        )}
      />

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {activeTab === "sport" ? <SportView /> : <WorkView />}
      </main>

      <footer className="border-t border-sumi-200/60 py-5 text-center text-xs text-sumi-400">
        <p className="flex items-center justify-center gap-3 font-serifJp text-sumi-300">
          <span className="text-sakura-300" aria-label="printemps">桜</span>
          <span className="text-matcha-300" aria-label="été">夏</span>
          <span className="text-shu-300" aria-label="automne">秋</span>
          <span className="text-ai-300" aria-label="hiver">冬</span>
        </p>
        <p className="mt-2">
          Toki <span className="font-serifJp">時</span> — sans compte, sans
          mémoire. Ouvre, respire, commence.
        </p>
      </footer>
    </div>
  );
}
