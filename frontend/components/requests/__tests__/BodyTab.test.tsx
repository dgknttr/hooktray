import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import BodyTab from "@/components/requests/BodyTab"

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

describe("BodyTab", () => {
  it("renders 'No body' when body is null", () => {
    render(<BodyTab body={null} isBase64Encoded={false} />)
    expect(screen.getByText(/no body/i)).toBeInTheDocument()
  })

  it("renders plain pre for non-JSON body", () => {
    render(<BodyTab body="plain text" isBase64Encoded={false} />)
    expect(screen.getByText("plain text")).toBeInTheDocument()
  })

  it("renders raw JSON by default", () => {
    render(<BodyTab body='{"key":"val"}' isBase64Encoded={false} />)
    expect(screen.getByText('{"key":"val"}')).toBeInTheDocument()
  })

  it("renders formatted JSON after switching to Pretty", () => {
    render(<BodyTab body='{"key":"val"}' isBase64Encoded={false} />)
    fireEvent.click(screen.getByRole("button", { name: /pretty/i }))
    expect(screen.getByText(/"key": "val"/i)).toBeInTheDocument()
  })

  it("disables Pretty for non-JSON body", () => {
    render(<BodyTab body="plain text" isBase64Encoded={false} />)
    expect(screen.getByRole("button", { name: /pretty/i })).toBeDisabled()
  })

  it("shows base64 notice for binary content", () => {
    render(<BodyTab body="SGVsbG8=" isBase64Encoded={true} />)
    expect(screen.getByText(/binary content/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /pretty/i })).toBeDisabled()
  })

  it("[Copy] writes the visible body to clipboard", async () => {
    render(<BodyTab body="plain text" isBase64Encoded={false} />)
    fireEvent.click(screen.getByRole("button", { name: /copy body/i }))
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("plain text")
    )
  })

  it("[Copy] writes the pretty body while Pretty is selected", async () => {
    render(<BodyTab body='{"key":"val"}' isBase64Encoded={false} />)
    fireEvent.click(screen.getByRole("button", { name: /pretty/i }))
    fireEvent.click(screen.getByRole("button", { name: /copy body/i }))
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        '{\n  "key": "val"\n}'
      )
    )
  })
})
