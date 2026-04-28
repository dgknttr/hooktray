function getHookOrigin(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== "undefined") return window.location.origin
  return "http://localhost:5221"
}

export function generateCurlExample(token: string): string {
  return `curl -X POST ${getHookOrigin()}/hooks/${token} \\
  -H "Content-Type: application/json" \\
  -d '{"test": true}'`
}
