export type ConnectionStatus = "connected" | "reconnecting" | "disconnected"
export type Theme = "light" | "dark" | "system"
export type MethodFilter = "ALL" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface RequestSnapshotWire {
  id: string
  receivedAt: string
  method: string
  path: string
  rawQueryString: string
  queryParams: Record<string, string>
  headers: Record<string, string>
  body: string | null
  bodyEncoding: string
  isBase64Encoded: boolean
  bodyPreview: string | null
  sizeBytes: number
}
