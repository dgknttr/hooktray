import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import sitemap from "./sitemap"

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://hooktray.com")
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("sitemap", () => {
  it("includes each provider guide once with lower priority than the webhook tester", () => {
    const entries = sitemap()
    const webhookTester = entries.find((entry) => entry.url === "https://hooktray.com/webhook-tester")
    const guideUrls = [
      "https://hooktray.com/guides/test-stripe-webhooks",
      "https://hooktray.com/guides/test-shopify-webhooks",
    ]

    expect(webhookTester).toBeDefined()

    for (const url of guideUrls) {
      const matches = entries.filter((entry) => entry.url === url)

      expect(matches).toHaveLength(1)
      expect(matches[0].changeFrequency).toBe("monthly")
      expect(matches[0].priority).toBeLessThan(webhookTester!.priority!)
    }
  })

  it("uses the environment base URL and removes trailing slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.hooktray.test///")

    const entries = sitemap()

    expect(entries).toContainEqual(
      expect.objectContaining({
        url: "https://preview.hooktray.test/guides/test-stripe-webhooks",
      }),
    )
    expect(entries).toContainEqual(
      expect.objectContaining({
        url: "https://preview.hooktray.test/guides/test-shopify-webhooks",
      }),
    )
    expect(entries.every((entry) => entry.url.startsWith("https://preview.hooktray.test/"))).toBe(
      true,
    )
  })
})
