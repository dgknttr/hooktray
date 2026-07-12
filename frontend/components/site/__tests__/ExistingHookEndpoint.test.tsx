import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ExistingHookEndpoint } from "@/components/site/ExistingHookEndpoint"

describe("ExistingHookEndpoint", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("shows the existing inspector endpoint inside the guide", async () => {
    localStorage.setItem("lastActiveToken", "tok1")

    render(<ExistingHookEndpoint />)

    expect(await screen.findByText(`${window.location.origin}/hooks/tok1`)).toBeInTheDocument()
    expect(screen.getByText(/paste this endpoint into your provider/i)).toBeInTheDocument()
  })

  it("copies the existing endpoint", async () => {
    const user = userEvent.setup()
    localStorage.setItem("lastActiveToken", "tok1")
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })

    render(<ExistingHookEndpoint />)
    await user.click(await screen.findByRole("button", { name: /copy endpoint/i }))

    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/hooks/tok1`)
  })

  it("points to the inspector when this browser has no endpoint yet", async () => {
    render(<ExistingHookEndpoint />)

    expect(
      await screen.findByText(/this browser does not have a HookTray endpoint yet/i),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /open the inspector/i })).toHaveAttribute("href", "/")
  })
})
