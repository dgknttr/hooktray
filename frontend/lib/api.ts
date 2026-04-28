const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ""

export function buildHookUrl(token: string): string {
  return `${API_BASE}/hooks/${token}`
}

export function buildStreamUrl(token: string): string {
  return `${API_BASE}/api/stream/${token}`
}

export async function createHook(): Promise<{
  token: string
  hookUrl: string
  streamUrl: string
}> {
  const res = await fetch(`${API_BASE}/api/hooks`, { method: "POST" })
  if (!res.ok) throw new Error(`Failed to create hook: ${res.status}`)
  return res.json()
}

export async function resolveInitialToken(): Promise<{
  token: string
  hookUrl: string
  streamUrl: string
}> {
  const params = new URLSearchParams(window.location.search)
  const urlToken = params.get("t")
  if (urlToken) {
    return { token: urlToken, hookUrl: buildHookUrl(urlToken), streamUrl: buildStreamUrl(urlToken) }
  }

  const stored = localStorage.getItem("lastActiveToken")
  if (stored) {
    return { token: stored, hookUrl: buildHookUrl(stored), streamUrl: buildStreamUrl(stored) }
  }

  return createHook()
}
