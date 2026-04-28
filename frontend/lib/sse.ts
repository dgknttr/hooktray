import type { RequestSnapshotWire } from "@/types"

export type SSECallbacks = {
  onConnected: () => void
  onReconnecting: () => void
  onDisconnected: () => void
  onRequest: (data: RequestSnapshotWire) => void
}

export function createSSEConnection(
  streamUrl: string,
  callbacks: SSECallbacks
): () => void {
  const es = new EventSource(streamUrl)

  es.onopen = () => callbacks.onConnected()

  es.onerror = () => {
    if (es.readyState === EventSource.CONNECTING) {
      callbacks.onReconnecting()
    }
  }

  es.addEventListener("request", (e: Event) => {
    try {
      const data = JSON.parse((e as MessageEvent).data) as RequestSnapshotWire
      callbacks.onRequest(data)
    } catch (err) {
      console.warn("[HookTray] Malformed SSE event:", err)
    }
  })

  return () => {
    es.close()
    callbacks.onDisconnected()
  }
}
