import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import ShopifyWebhookGuidePage, { metadata } from "./page"

describe("ShopifyWebhookGuidePage", () => {
  it("provides descriptive Shopify webhook metadata", () => {
    expect(metadata.title).toMatch(/^Shopify Webhook Tester/)
    expect(metadata.description).toMatch(/temporary endpoint/i)
    expect(metadata.description).toMatch(/inspect (Shopify )?webhook deliveries/i)
    expect(metadata.description).toMatch(/no account required/i)
  })

  it("explains Shopify topics and both ways to trigger a delivery", () => {
    render(<ShopifyWebhookGuidePage />)

    expect(
      screen.getByRole("heading", { level: 1, name: "How to Test Shopify Webhooks" }),
    ).toBeInTheDocument()
    expect(screen.getByText("orders/create")).toBeInTheDocument()
    expect(screen.getByText("products/update")).toBeInTheDocument()
    expect(screen.getByText("refunds/create")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Test a real store action" })).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Use a Shopify CLI sample trigger" }),
    ).toBeInTheDocument()
    expect(screen.getByText(/CLI payload is fixed/i)).toBeInTheDocument()
    expect(screen.getByText(/CLI-triggered webhook is not retried on failure/i)).toBeInTheDocument()
    expect(screen.getByText(/real store action is needed for end-to-end confidence/i)).toBeInTheDocument()
  })

  it("sets the inspection and HMAC validation boundary", () => {
    render(<ShopifyWebhookGuidePage />)

    expect(screen.getByText(/X-Shopify-Topic/i)).toBeInTheDocument()
    expect(screen.getByText(/X-Shopify-Webhook-Id/i)).toBeInTheDocument()
    expect(screen.getByText(/X-Shopify-Hmac-Sha256/i)).toBeInTheDocument()
    expect(screen.getByText(/inspect the JSON payload/i)).toBeInTheDocument()
    expect(screen.getByText(/response status/i)).toBeInTheDocument()
    expect(
      screen.getByText(/HookTray displays the HMAC header but does not currently validate it/i),
    ).toBeInTheDocument()
  })

  it("covers Shopify delivery troubleshooting themes", () => {
    render(<ShopifyWebhookGuidePage />)

    expect(screen.getByRole("heading", { name: /raw-body HMAC/i })).toBeInTheDocument()
    expect(screen.getByText(/HMAC verification requires the raw request body/i)).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /duplicate deliveries and idempotency/i })).toBeInTheDocument()
    expect(screen.getByText(/webhook ID as an idempotency key/i)).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /unordered events/i })).toBeInTheDocument()
    expect(screen.getByText(/five-second response timeout/i)).toBeInTheDocument()
    expect(screen.getByText(/Shopify retries failed deliveries/i)).toBeInTheDocument()
    expect(screen.getByText(/subscription can be removed after repeated failures/i)).toBeInTheDocument()
  })

  it("links to the tool, related guide, official docs, and source", () => {
    render(<ShopifyWebhookGuidePage />)

    expect(screen.getByRole("link", { name: "Open HookTray" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Webhook tester" })).toHaveAttribute(
      "href",
      "/webhook-tester",
    )

    const externalLinks = [
      ["Shopify webhooks documentation", "https://shopify.dev/docs/apps/build/webhooks"],
      [
        "Shopify delivery verification documentation",
        "https://shopify.dev/docs/apps/build/webhooks/verify-deliveries",
      ],
      [
        "Shopify webhook troubleshooting documentation",
        "https://shopify.dev/docs/apps/build/webhooks/troubleshoot",
      ],
      [
        "Shopify CLI webhook trigger documentation",
        "https://shopify.dev/docs/api/shopify-cli/app/app-webhook-trigger",
      ],
      ["Inspect the source", "https://github.com/dgknttr/hooktray"],
    ] as const

    for (const [name, href] of externalLinks) {
      const link = screen.getByRole("link", { name })

      expect(link).toHaveAttribute("href", href)
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel", "noopener noreferrer")
    }
  })
})
