import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import StripeWebhookGuidePage from "./page"

describe("StripeWebhookGuidePage", () => {
  it("explains Stripe webhook inspection and links to HookTray", () => {
    render(<StripeWebhookGuidePage />)

    expect(
      screen.getByRole("heading", { level: 1, name: "How to Test Stripe Webhooks" }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Stripe-Signature/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Open HookTray" })).toHaveAttribute("href", "/")
  })

  it("links to its sources and states the signature validation boundary", () => {
    render(<StripeWebhookGuidePage />)

    expect(screen.getByRole("link", { name: "Stripe webhook documentation" })).toHaveAttribute(
      "href",
      "https://docs.stripe.com/webhooks",
    )
    expect(screen.getByRole("link", { name: "Stripe signature documentation" })).toHaveAttribute(
      "href",
      "https://docs.stripe.com/webhooks/signature",
    )
    expect(screen.getByRole("link", { name: "Inspect the source" })).toHaveAttribute(
      "href",
      "https://github.com/dgknttr/hooktray",
    )
    expect(screen.getByText(/does not validate the signature/i)).toBeInTheDocument()
  })
})
