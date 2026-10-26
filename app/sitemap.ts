export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { riders } from "@/content/site";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://otownwatersports.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/coaching", "/rates", "/athletes", "/stay", "/plan", "/waiver", "/card", ...riders.map((r) => `/athletes/${r.key}`)].map((p) => ({
    url: `${SITE}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p.startsWith("/athletes/") ? 0.6 : 0.8,
  }));
}
