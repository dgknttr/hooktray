export const SENSITIVE_HEADERS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "x-auth-token",
  "x-secret",
  "x-access-token",
  "proxy-authorization",
])

export function isMasked(header: string): boolean {
  return SENSITIVE_HEADERS.has(header.toLowerCase())
}
