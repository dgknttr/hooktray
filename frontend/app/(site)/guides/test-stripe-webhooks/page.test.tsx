import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import StripeWebhookGuidePage, { metadata } from "./page"

describe("StripeWebhookGuidePage", () => {
  it("provides descriptive Stripe webhook metadata", () => {
    expect(metadata.title).toMatch(/^Stripe Webhook Tester/)
    expect(metadata.description).toMatch(/temporary endpoint/i)
    expect(metadata.description).toMatch(/inspect Stripe webhooks in real time/i)
    expect(metadata.description).toMatch(/no account required/i)
  })

  it("explains Stripe events and provides a numbered Workbench setup flow", () => {
    render(<StripeWebhookGuidePage />)

    expect(
      screen.getByRole("heading", { level: 1, name: "How to Test Stripe Webhooks" }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Stripe-Signature/i)).toBeInTheDocument()
    expect(screen.getByText("payment_intent.succeeded")).toBeInTheDocument()
    expect(screen.getByText("invoice.paid")).toBeInTheDocument()
    expect(screen.getByText("customer.subscription.updated")).toBeInTheDocument()
    const setupHeading = screen.getByRole("heading", {
      name: "Set up a test destination in Stripe Workbench",
    })
    const setupSection = setupHeading.closest("section")

    expect(setupSection).not.toBeNull()
    const setup = within(setupSection as HTMLElement)
    expect(setup.getByRole("list").tagName).toBe("OL")
    expect(setup.getByText(/copy the generated hook URL/i)).toBeInTheDocument()
    expect(setup.getByText(/create a new event destination/i)).toBeInTheDocument()
    const setupSteps = setup.getAllByRole("listitem").map((item) => item.textContent)
    expect(
      setupSteps.some((step) => /performing the corresponding test-mode action/i.test(step ?? "")),
    ).toBe(true)
    expect(setup.getByText("stripe trigger payment_intent.succeeded")).toBeInTheDocument()
    expect(setup.queryByText(/use Workbench to send a test event/i)).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Open HookTray" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Webhook tester" })).toHaveAttribute(
      "href",
      "/webhook-tester",
    )
  })

  it("covers common Stripe webhook troubleshooting topics", () => {
    render(<StripeWebhookGuidePage />)

    expect(screen.getByRole("heading", { name: "Wrong endpoint secret" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Raw body mutation" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /test and live mode/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Non-2xx responses" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /retries/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Unordered events" })).toBeInTheDocument()
    expect(screen.getByText(/does not validate the signature/i)).toBeInTheDocument()
  })

  it("links safely to the official documentation and source", () => {
    render(<StripeWebhookGuidePage />)

    const externalLinks = [
      ["Stripe webhook documentation", "https://docs.stripe.com/webhooks"],
      ["Stripe signature documentation", "https://docs.stripe.com/webhooks/signature"],
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
