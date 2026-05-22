// app/components/layout/Header.tsx — Header fixe : logo 時 Toki à gauche, TabNav + VolumeControl à droite.
"use client";

import type { ActiveTab } from "@/lib/types";
import { TabNav } from "./TabNav";
import { VolumeControl } from "@/app/components/audio/VolumeControl";

type HeaderProps = {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
};

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-sumi-200/60 bg-washi/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div
          aria-label="Toki"
          className="flex items-baseline gap-2 group select-none"
        >
          <span
            aria-hidden
            className="font-serifJp text-3xl sm:text-4xl text-sumi-900 leading-none transition-transform duration-500 ease-out group-hover:scale-105 group-hover:text-shu-700"
          >
            時
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xl sm:text-2xl text-sumi-900">
              Toki
            </span>
            <span className="hidden sm:inline text-[10px] text-sumi-400 tracking-wide">
              Maîtrise ton temps.
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <TabNav activeTab={activeTab} onChange={onTabChange} />
          <span aria-hidden className="hidden sm:block h-6 w-px bg-sumi-200" />
          <VolumeControl />
        </div>
      </div>
    </header>
  );
}
