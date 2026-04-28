import { useState, useEffect } from "react"
import { formatRelativeTime } from "@/lib/format"

export function useRelativeTime(receivedAt: string): string {
  const ts = new Date(receivedAt).getTime()
  const [text, setText] = useState(() => formatRelativeTime(ts))

  useEffect(() => {
    const interval = setInterval(
      () => setText(formatRelativeTime(new Date(receivedAt).getTime())),
      5000
    )
    return () => clearInterval(interval)
  }, [receivedAt])

  return text
}
