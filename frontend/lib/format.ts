export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  if (diff < 1000) return "just now"
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  return `${Math.floor(diff / 3600000)}h ago`
}

export function formatJsonBody(body: string): string | null {
  try {
    return JSON.stringify(JSON.parse(body), null, 2)
  } catch {
    return null
  }
}
