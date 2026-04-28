import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import BodyTab from "@/components/requests/BodyTab"

vi.mock("shiki", () => ({
  createHighlighter: vi.fn().mockResolvedValue({
    codeToHtml: vi.fn().mockReturnValue('<pre><code class="shiki">{"key":"val"}</code></pre>'),
  }),
}))

vi.mock("@/app/providers", () => ({
  useTheme: () => ({ resolvedTheme: "light", theme: "light", setTheme: vi.fn() }),
}))

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

  it("renders Shiki container for valid JSON body", async () => {
    render(<BodyTab body='{"key":"val"}' isBase64Encoded={false} />)
    await waitFor(() =>
      expect(document.querySelector(".shiki")).toBeInTheDocument()
    )
  })

  it("shows base64 notice for binary content", () => {
    render(<BodyTab body="SGVsbG8=" isBase64Encoded={true} />)
    expect(screen.getByText(/binary content/i)).toBeInTheDocument()
  })

  it("[Copy body] writes body to clipboard", async () => {
    render(<BodyTab body="plain text" isBase64Encoded={false} />)
    fireEvent.click(screen.getByRole("button", { name: /copy body/i }))
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("plain text")
    )
  })
})
