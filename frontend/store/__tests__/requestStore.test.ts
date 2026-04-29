import { describe, it, expect, beforeEach, vi } from "vitest"
import { useRequestStore } from "@/store/requestStore"
import type { RequestSnapshotWire } from "@/types"

vi.mock("@/lib/db", () => ({
  clearHistory: vi.fn().mockResolvedValue(undefined),
  markRequestRead: vi.fn().mockResolvedValue(undefined),
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

function localSnap(id: string, localOrdinal: number, isRead = false) {
  return { ...snap(id), localOrdinal, isRead }
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

  it("addRequest assigns arrival-order localOrdinal", () => {
    const first = useRequestStore.getState().addRequest(snap("s1"))
    const second = useRequestStore.getState().addRequest(snap("s2"))
    expect(first.localOrdinal).toBe(1)
    expect(second.localOrdinal).toBe(2)
  })

  it("addRequest auto-selects and marks read when no request is selected", () => {
    useRequestStore.getState().addRequest(snap("s1"))
    const s = useRequestStore.getState()
    expect(s.selectedId).toBe("s1")
    expect(s.requests[0].isRead).toBe(true)
  })

  it("addRequest does not steal selection from an existing request", () => {
    useRequestStore.getState().addRequest(snap("s1"))
    useRequestStore.getState().addRequest(snap("s2"))
    const s = useRequestStore.getState()
    expect(s.selectedId).toBe("s1")
    expect(s.requests[0].id).toBe("s2")
    expect(s.requests[0].isRead).toBe(false)
  })

  it("addRequest caps at 500 requests", () => {
    for (let i = 0; i < 501; i++) {
      useRequestStore.getState().addRequest(snap(`s${i}`))
    }
    expect(useRequestStore.getState().requests).toHaveLength(500)
  })

  it("selectRequest sets selectedId", () => {
    useRequestStore.getState().hydrate([localSnap("s1", 1)])
    useRequestStore.getState().selectRequest("s1")
    expect(useRequestStore.getState().selectedId).toBe("s1")
  })

  it("selectRequest marks the request read", () => {
    useRequestStore.getState().hydrate([localSnap("s1", 1), localSnap("s2", 2)])
    useRequestStore.getState().selectRequest("s2")
    const selected = useRequestStore.getState().requests.find((r) => r.id === "s2")
    expect(selected?.isRead).toBe(true)
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
    useRequestStore.getState().hydrate([localSnap("s1", 1), localSnap("s2", 2)])
    expect(useRequestStore.getState().requests).toHaveLength(2)
  })

  it("hydrate selects the newest request when none is selected", () => {
    const selectedId = useRequestStore.getState().hydrate([
      localSnap("newest", 2),
      localSnap("oldest", 1),
    ])
    expect(selectedId).toBe("newest")
    expect(useRequestStore.getState().selectedId).toBe("newest")
    expect(useRequestStore.getState().requests[0].isRead).toBe(true)
  })
})
