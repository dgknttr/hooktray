import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import TopBar from "@/components/layout/TopBar"
import { useConnectionStore } from "@/store/connectionStore"

vi.mock("@/app/providers", () => ({
  useTheme: () => ({ theme: "system", setTheme: vi.fn(), resolvedTheme: "light" }),
}))

beforeEach(() => {
  useConnectionStore.setState({
    status: "connected",
    token: "tok1",
    hookUrl: "https://hooktray.com/hooks/tok1",
  })
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

describe("TopBar", () => {
  it("renders hookUrl", () => {
    render(<TopBar />)
    expect(screen.getByText("https://hooktray.com/hooks/tok1")).toBeInTheDocument()
  })

  it("shows 'Connected' badge when status is connected", () => {
    render(<TopBar />)
    expect(screen.getByText("Connected")).toBeInTheDocument()
  })

  it("shows 'Reconnecting' badge when status is reconnecting", () => {
    useConnectionStore.setState({ status: "reconnecting", token: null, hookUrl: null })
    render(<TopBar />)
    expect(screen.getByText("Reconnecting")).toBeInTheDocument()
  })

  it("shows 'Disconnected' badge when status is disconnected", () => {
    useConnectionStore.setState({ status: "disconnected", token: null, hookUrl: null })
    render(<TopBar />)
    expect(screen.getByText("Disconnected")).toBeInTheDocument()
  })

  it("clicking copy writes hookUrl to clipboard", async () => {
    render(<TopBar />)
    fireEvent.click(screen.getByRole("button", { name: /copy/i }))
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "https://hooktray.com/hooks/tok1"
      )
    })
  })

  it("shows 'Copied!' feedback after copy", async () => {
    render(<TopBar />)
    fireEvent.click(screen.getByRole("button", { name: /copy/i }))
    await waitFor(() => expect(screen.getByText("Copied!")).toBeInTheDocument())
  })
})
