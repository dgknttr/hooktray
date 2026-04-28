import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import RequestListItem from "@/components/requests/RequestListItem"
import type { RequestSnapshotWire } from "@/types"

vi.mock("@/hooks/useRelativeTime", () => ({
  useRelativeTime: () => "just now",
}))

function snap(method: string): RequestSnapshotWire {
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
