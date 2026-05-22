// lib/utils.ts — Utilitaires partagés (cn pour fusion conditionnelle de classes Tailwind, requis par shadcn/ui)
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
