import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/auth";

const siteUrl = getAppUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing"],
        disallow: [
          "/dashboard/",
          "/api/",
          "/auth/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
