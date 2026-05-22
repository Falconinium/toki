// app/sitemap.ts — Génère /sitemap.xml au build. Une seule URL : la page d'accueil (SPA single-page).
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
