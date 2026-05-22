// app/opengraph-image.tsx — Image Open Graph générée dynamiquement au build (Next 14).
// 1200×630 — kanji 時 + Toki + tagline sur fond washi. Affichée en preview sur réseaux sociaux et Vercel.
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Toki (時) — Minuteur japonais pour le sport et le travail";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf8f4",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(61, 55, 47, 0.06) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          color: "#272420",
          fontFamily: "serif",
        }}
      >
        {/* Kanji principal */}
        <div
          style={{
            fontSize: 380,
            lineHeight: 1,
            fontWeight: 700,
            color: "#272420",
            marginBottom: 16,
          }}
        >
          時
        </div>

        {/* Nom de l'app */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 400,
            color: "#272420",
            letterSpacing: -2,
            marginTop: 8,
          }}
        >
          Toki
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#6b6259",
            marginTop: 24,
            letterSpacing: 1,
          }}
        >
          Maîtrise ton temps.
        </div>

        {/* Bande inférieure : 4 couleurs des saisons */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 56,
          }}
        >
          <div style={{ width: 64, height: 8, background: "#f9a8b8", borderRadius: 4 }} />
          <div style={{ width: 64, height: 8, background: "#7fbf7f", borderRadius: 4 }} />
          <div style={{ width: 64, height: 8, background: "#ff9f6a", borderRadius: 4 }} />
          <div style={{ width: 64, height: 8, background: "#8b96f0", borderRadius: 4 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
