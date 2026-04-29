import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import SignalPulseEmptyState from "@/components/requests/SignalPulseEmptyState"

describe("SignalPulseEmptyState", () => {
  it("renders waiting copy, curl example, and GitHub links", () => {
    render(<SignalPulseEmptyState token="tok1" />)

    expect(screen.getByText("Waiting for first request")).toBeInTheDocument()
    expect(
      screen.getByText(/request details will appear here/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/curl -X POST/)).toHaveTextContent("/hooks/tok1")
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/dgknttr/hooktray"
    )
    expect(screen.getByRole("link", { name: "Star on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/dgknttr/hooktray"
    )
  })
})
