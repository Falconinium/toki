// app/components/layout/TabNav.tsx — Navigation entre les deux univers : Sport (スポーツ) et Travail (仕事).
// L'onglet actif a un underline animé dans la couleur dominante de la section (shu pour Sport, ai pour Travail).
"use client";

import { cn } from "@/lib/utils";
import type { ActiveTab } from "@/lib/types";

type TabNavProps = {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
};

const TABS: Array<{
  id: ActiveTab;
  label: string;
  jp: string;
  activeColor: string;
}> = [
  { id: "sport", label: "Sport", jp: "スポーツ", activeColor: "bg-shu-500" },
  { id: "work", label: "Travail", jp: "仕事", activeColor: "bg-ai-500" },
];

export function TabNav({ activeTab, onChange }: TabNavProps) {
  return (
    <nav
      role="tablist"
      aria-label="Univers Toki"
      className="flex items-center gap-1 sm:gap-2"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-3 sm:px-4 py-2 rounded-md transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-washi",
              isActive
                ? "text-sumi-900"
                : "text-sumi-600 hover:text-sumi-800 hover:bg-sumi-50"
            )}
          >
            <span className="flex flex-col items-center leading-tight">
              <span className="text-sm sm:text-base font-medium">
                {tab.label}
              </span>
              <span className="text-[10px] sm:text-xs font-serifJp text-sumi-400">
                {tab.jp}
              </span>
            </span>
            <span
              aria-hidden
              className={cn(
                "absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full transition-all duration-300",
                isActive
                  ? `${tab.activeColor} opacity-100 scale-x-100`
                  : "bg-transparent opacity-0 scale-x-50"
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
