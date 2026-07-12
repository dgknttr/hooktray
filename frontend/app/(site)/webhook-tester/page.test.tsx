import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import WebhookTesterPage from "./page"

describe("WebhookTesterPage", () => {
  it("links to provider-specific webhook guides", () => {
    render(<WebhookTesterPage />)

    expect(screen.getByRole("link", { name: "Test Stripe webhooks" })).toHaveAttribute(
      "href",
      "/guides/test-stripe-webhooks",
    )
    expect(screen.getByRole("link", { name: "Test Shopify webhooks" })).toHaveAttribute(
      "href",
      "/guides/test-shopify-webhooks",
    )
  })

  it("retains the generic webhook testing content and primary action", () => {
    render(<WebhookTesterPage />)

    expect(screen.getByRole("heading", { level: 1, name: "Webhook Tester" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Quick webhook test" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Start testing" })).toHaveAttribute("href", "/")
  })
})
