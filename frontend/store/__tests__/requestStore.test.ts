import { describe, it, expect, beforeEach, vi } from "vitest"
import { useRequestStore } from "@/store/requestStore"
import type { RequestSnapshotWire } from "@/types"

vi.mock("@/lib/db", () => ({
  clearHistory: vi.fn().mockResolvedValue(undefined),
}))

function snap(id: string, method = "POST"): RequestSnapshotWire {
  return {
    id,
    receivedAt: new Date().toISOString(),
    method,
    path: "/test",
    rawQueryString: "",
    queryParams: {},
    headers: {},
    body: null,
    bodyEncoding: "utf-8",
    isBase64Encoded: false,
    bodyPreview: null,
    sizeBytes: 0,
  }
}

describe("requestStore", () => {
  beforeEach(() => {
    useRequestStore.setState({
      requests: [],
      selectedId: null,
      filter: "ALL",
      autoScroll: true,
    })
  })

  it("addRequest prepends (newest first)", () => {
    useRequestStore.getState().addRequest(snap("s1"))
    useRequestStore.getState().addRequest(snap("s2"))
    const { requests } = useRequestStore.getState()
    expect(requests[0].id).toBe("s2")
    expect(requests[1].id).toBe("s1")
  })

  it("addRequest caps at 500 requests", () => {
    for (let i = 0; i < 501; i++) {
      useRequestStore.getState().addRequest(snap(`s${i}`))
    }
    expect(useRequestStore.getState().requests).toHaveLength(500)
  })

  it("selectRequest sets selectedId", () => {
    useRequestStore.getState().selectRequest("s1")
    expect(useRequestStore.getState().selectedId).toBe("s1")
  })

  it("setFilter updates filter", () => {
    useRequestStore.getState().setFilter("POST")
    expect(useRequestStore.getState().filter).toBe("POST")
  })

  it("setAutoScroll updates autoScroll", () => {
    useRequestStore.getState().setAutoScroll(false)
    expect(useRequestStore.getState().autoScroll).toBe(false)
  })

  it("clearHistory empties requests and clears selectedId", () => {
    useRequestStore.getState().addRequest(snap("s1"))
    useRequestStore.getState().selectRequest("s1")
    useRequestStore.getState().clearHistory("tok1")
    const s = useRequestStore.getState()
    expect(s.requests).toHaveLength(0)
    expect(s.selectedId).toBeNull()
  })

  it("hydrate sets requests array", () => {
    useRequestStore.getState().hydrate([snap("s1"), snap("s2")])
    expect(useRequestStore.getState().requests).toHaveLength(2)
  })
})
