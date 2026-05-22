// app/layout.tsx — Layout racine : fonts Toki (Noto Serif JP, DM Serif Display, Outfit, Space Mono), metadata SEO, fond washi
import type { Metadata, Viewport } from "next";
import {
  Noto_Serif_JP,
  DM_Serif_Display,
  Outfit,
  Space_Mono,
} from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/app/components/audio/SoundProvider";

const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

// Base URL utilisée pour rendre absolues les URLs OG, sitemap, robots, etc.
// NEXT_PUBLIC_SITE_URL si défini, sinon Vercel l'auto-injecte (preview/prod), sinon localhost.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Toki (時) — Minuteur japonais pour le sport et le travail",
  description:
    "Timer en ligne gratuit inspiré du Japon. Tabata, EMOM, AMRAP, Pomodoro et mode Flow. Sans compte, sans inscription.",
  keywords: [
    "timer",
    "minuteur",
    "pomodoro",
    "tabata",
    "japonais",
    "sport",
    "focus",
    "flow",
  ],
  authors: [{ name: "Toki" }],
  openGraph: {
    title: "Toki (時) — Maîtrise ton temps",
    description:
      "Minuteur en ligne d'inspiration japonaise. Sport (Tabata/EMOM/AMRAP) et Travail (Pomodoro/Flow). Sans compte.",
    type: "website",
    locale: "fr_FR",
    siteName: "Toki",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toki (時) — Maîtrise ton temps",
    description:
      "Minuteur en ligne d'inspiration japonaise. Tabata, Pomodoro, mode Flow. Sans compte.",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${notoSerifJp.variable} ${dmSerifDisplay.variable} ${outfit.variable} ${spaceMono.variable} font-sans bg-washi text-sumi-900 antialiased`}
      >
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
