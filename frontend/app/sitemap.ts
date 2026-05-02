import type { MetadataRoute } from "next"

export const dynamic = "force-static"

const DEFAULT_SITE_URL = "https://hooktray.com"

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "")
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()

  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/webhook-inspector`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/webhook-tester`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/webhook-site-alternative`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/how-it-works`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/use-cases`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/self-hosting`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ]
}
