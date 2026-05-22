// tailwind.config.ts — Config Tailwind avec palette Toki "Shiki" (四季 — les quatre saisons japonaises)
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === Palette Toki — Saisons japonaises ===
        sakura: {
          50: "var(--toki-sakura-50)",
          100: "var(--toki-sakura-100)",
          300: "var(--toki-sakura-300)",
          500: "var(--toki-sakura-500)",
          700: "var(--toki-sakura-700)",
        },
        ai: {
          50: "var(--toki-ai-50)",
          100: "var(--toki-ai-100)",
          300: "var(--toki-ai-300)",
          500: "var(--toki-ai-500)",
          700: "var(--toki-ai-700)",
          900: "var(--toki-ai-900)",
        },
        matcha: {
          50: "var(--toki-matcha-50)",
          100: "var(--toki-matcha-100)",
          300: "var(--toki-matcha-300)",
          500: "var(--toki-matcha-500)",
          700: "var(--toki-matcha-700)",
        },
        shu: {
          50: "var(--toki-shu-50)",
          100: "var(--toki-shu-100)",
          300: "var(--toki-shu-300)",
          500: "var(--toki-shu-500)",
          700: "var(--toki-shu-700)",
        },
        sumi: {
          50: "var(--toki-sumi-50)",
          100: "var(--toki-sumi-100)",
          200: "var(--toki-sumi-200)",
          400: "var(--toki-sumi-400)",
          600: "var(--toki-sumi-600)",
          800: "var(--toki-sumi-800)",
          900: "var(--toki-sumi-900)",
        },
        washi: "var(--toki-washi)",

        // === Tokens shadcn/ui (mappés sur la palette Toki) ===
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
      },
      fontFamily: {
        serifJp: ["var(--font-noto-serif-jp)", "serif"],
        display: ["var(--font-dm-serif-display)", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slow-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.02)", opacity: "0.9" },
        },
      },
      animation: {
        "fade-in": "fade-in 300ms ease-out",
        "fade-in-up": "fade-in-up 400ms ease-out",
        "slow-pulse": "slow-pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
