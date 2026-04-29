import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import RequestListEmptyState from "@/components/requests/RequestListEmptyState"

describe("RequestListEmptyState", () => {
  it("renders a compact queue placeholder", () => {
    render(<RequestListEmptyState />)

    expect(screen.getByText("Request queue ready")).toBeInTheDocument()
    expect(
      screen.getByText(/incoming webhooks will appear here/i)
    ).toBeInTheDocument()
    expect(screen.getAllByText("POST").length).toBeGreaterThan(0)
    expect(screen.getByText("#1")).toBeInTheDocument()
  })
})
