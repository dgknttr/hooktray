import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import HeadersTab from "@/components/requests/HeadersTab"

describe("HeadersTab", () => {
  const headers = {
    "content-type": "application/json",
    "authorization": "Bearer secret-token",
    "x-api-key": "my-api-key",
  }

  it("renders non-sensitive headers in plain text", () => {
    render(<HeadersTab headers={headers} />)
    expect(screen.getByText("application/json")).toBeInTheDocument()
  })

  it("masks sensitive headers initially", () => {
    render(<HeadersTab headers={headers} />)
    const maskedValues = screen.getAllByText("••••••••")
    expect(maskedValues.length).toBeGreaterThanOrEqual(2)
  })

  it("shows [Show] toggle for sensitive headers", () => {
    render(<HeadersTab headers={headers} />)
    const showButtons = screen.getAllByRole("button", { name: /show/i })
    expect(showButtons.length).toBeGreaterThanOrEqual(2)
  })

  it("clicking [Show] reveals the value", () => {
    render(<HeadersTab headers={headers} />)
    const showButtons = screen.getAllByRole("button", { name: /show/i })
    showButtons.forEach((btn) => fireEvent.click(btn))
    expect(screen.queryByText("••••••••")).not.toBeInTheDocument()
  })

  it("clicking [Show] then [Hide] re-masks the value", () => {
    const single = { "content-type": "application/json", "authorization": "Bearer secret-token" }
    render(<HeadersTab headers={single} />)
    const showButton = screen.getByRole("button", { name: /show/i })
    fireEvent.click(showButton)
    const hideButton = screen.getByRole("button", { name: /hide/i })
    fireEvent.click(hideButton)
    expect(screen.getByText("••••••••")).toBeInTheDocument()
  })
})
