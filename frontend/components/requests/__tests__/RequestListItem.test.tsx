import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import RequestListItem from "@/components/requests/RequestListItem"
import type { LocalRequestSnapshot } from "@/types"

vi.mock("@/hooks/useRelativeTime", () => ({
  useRelativeTime: () => "just now",
}))

function snap(method: string, isRead = true): LocalRequestSnapshot {
  return {
    id: "s1",
    receivedAt: "2020-01-01T00:00:00Z",
    method,
    path: "/webhooks/test",
    rawQueryString: "",
    queryParams: {},
    headers: {},
    body: null,
    bodyEncoding: "utf-8",
    isBase64Encoded: false,
    bodyPreview: null,
    sizeBytes: 1024,
    localOrdinal: 12,
    isRead,
  }
}

describe("RequestListItem", () => {
  it("renders the path", () => {
    render(<RequestListItem request={snap("POST")} isSelected={false} onClick={vi.fn()} isNew={false} />)
    expect(screen.getByText("/webhooks/test")).toBeInTheDocument()
  })

  it("renders the method badge", () => {
    render(<RequestListItem request={snap("POST")} isSelected={false} onClick={vi.fn()} isNew={false} />)
    expect(screen.getByText("POST")).toBeInTheDocument()
  })

  it("renders formatted size", () => {
    render(<RequestListItem request={snap("GET")} isSelected={false} onClick={vi.fn()} isNew={false} />)
    expect(screen.getByText("1.0 KB")).toBeInTheDocument()
  })

  it("renders the local request number", () => {
    render(<RequestListItem request={snap("POST")} isSelected={false} onClick={vi.fn()} isNew={false} />)
    expect(screen.getByText("#12")).toBeInTheDocument()
  })

  it("renders unread requests in bold", () => {
    render(<RequestListItem request={snap("POST", false)} isSelected={false} onClick={vi.fn()} isNew={false} />)
    expect(screen.getByRole("button")).toHaveClass("font-semibold")
  })

  it("keeps selected styling", () => {
    render(<RequestListItem request={snap("POST")} isSelected={true} onClick={vi.fn()} isNew={false} />)
    expect(screen.getByRole("button")).toHaveClass("bg-accent")
  })

  it("applies pulse class when isNew is true", () => {
    const { container } = render(
      <RequestListItem request={snap("POST")} isSelected={false} onClick={vi.fn()} isNew={true} />
    )
    expect(container.querySelector(".animate-ping")).toBeInTheDocument()
  })

  it("does not apply pulse class when isNew is false", () => {
    const { container } = render(
      <RequestListItem request={snap("POST")} isSelected={false} onClick={vi.fn()} isNew={false} />
    )
    expect(container.querySelector(".animate-ping")).not.toBeInTheDocument()
  })

  it("calls onClick when clicked", () => {
    const onClick = vi.fn()
    render(<RequestListItem request={snap("DELETE")} isSelected={false} onClick={onClick} isNew={false} />)
    screen.getByText("DELETE").closest("div")!.click()
    expect(onClick).toHaveBeenCalled()
  })
})
