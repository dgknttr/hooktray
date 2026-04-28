import { describe, it, expect, vi, beforeEach } from "vitest"
import type { RequestSnapshotWire } from "@/types"

class MockEventSource {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSED = 2
  readyState = MockEventSource.CONNECTING
  onopen: (() => void) | null = null
  onerror: (() => void) | null = null
  private listeners = new Map<string, (e: { data: string }) => void>()

  addEventListener(type: string, fn: (e: { data: string }) => void) {
    this.listeners.set(type, fn)
  }
  simulateOpen() {
    this.readyState = MockEventSource.OPEN
    this.onopen?.()
  }
  simulateError(state = MockEventSource.CONNECTING) {
    this.readyState = state
    this.onerror?.()
  }
  simulateMessage(type: string, data: string) {
    this.listeners.get(type)?.({ data })
  }
  close() {
    this.readyState = MockEventSource.CLOSED
  }
}

let mockEs: MockEventSource

const MockEventSourceCtor = vi.fn().mockImplementation(function () {
  mockEs = new MockEventSource()
  return mockEs
})
;(MockEventSourceCtor as unknown as Record<string, number>).CONNECTING = MockEventSource.CONNECTING
;(MockEventSourceCtor as unknown as Record<string, number>).OPEN = MockEventSource.OPEN
;(MockEventSourceCtor as unknown as Record<string, number>).CLOSED = MockEventSource.CLOSED

vi.stubGlobal("EventSource", MockEventSourceCtor)

describe("createSSEConnection", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let callbacks: any

  beforeEach(async () => {
    callbacks = {
      onConnected: vi.fn(),
      onReconnecting: vi.fn(),
      onDisconnected: vi.fn(),
      onRequest: vi.fn(),
    }
  })

  it("calls onConnected when connection opens", async () => {
    const { createSSEConnection } = await import("@/lib/sse")
    createSSEConnection("http://test/stream/tok", callbacks)
    mockEs.simulateOpen()
    expect(callbacks.onConnected).toHaveBeenCalledOnce()
  })

  it("calls onReconnecting on error while CONNECTING", async () => {
    const { createSSEConnection } = await import("@/lib/sse")
    createSSEConnection("http://test/stream/tok", callbacks)
    mockEs.simulateError(MockEventSource.CONNECTING)
    expect(callbacks.onReconnecting).toHaveBeenCalledOnce()
  })

  it("does not call onReconnecting when readyState is CLOSED", async () => {
    const { createSSEConnection } = await import("@/lib/sse")
    createSSEConnection("http://test/stream/tok", callbacks)
    mockEs.simulateError(MockEventSource.CLOSED)
    expect(callbacks.onReconnecting).not.toHaveBeenCalled()
  })

  it("calls onRequest with parsed JSON", async () => {
    const { createSSEConnection } = await import("@/lib/sse")
    createSSEConnection("http://test/stream/tok", callbacks)
    const snap: Partial<RequestSnapshotWire> = { id: "123", method: "POST" }
    mockEs.simulateMessage("request", JSON.stringify(snap))
    expect(callbacks.onRequest).toHaveBeenCalledWith(snap)
  })

  it("does not crash on malformed JSON", async () => {
    const { createSSEConnection } = await import("@/lib/sse")
    createSSEConnection("http://test/stream/tok", callbacks)
    expect(() => mockEs.simulateMessage("request", "not-json")).not.toThrow()
    expect(callbacks.onRequest).not.toHaveBeenCalled()
  })

  it("cleanup calls es.close() and onDisconnected", async () => {
    const { createSSEConnection } = await import("@/lib/sse")
    const cleanup = createSSEConnection("http://test/stream/tok", callbacks)
    cleanup()
    expect(callbacks.onDisconnected).toHaveBeenCalledOnce()
  })
})
