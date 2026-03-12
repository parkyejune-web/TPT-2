// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = "https://www.tradingpt.kr";

  const pages = [
    "",
    "/landing",
    "/home",
    "/login",
    "/signup",
    "/menu/about",
    "/menu/class-list",
    "/menu/insight",
    "/menu/analysis",
    "/feedback-list",
    "/menu/community/review",
    "/menu/growth",
    "/menu/tpt-plan",
    "/my/support",
    "/menu/guide/exchange",
    "/menu/guide/policy",
  ];

  return pages.map((path) => ({
    url: `${domain}${path}`,
    lastModified: new Date(),
  }));
}
