// app/robots.ts — Génère /robots.txt au build. Autorise tout (app publique, sans zone privée).
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "/sitemap.xml",
  };
}
