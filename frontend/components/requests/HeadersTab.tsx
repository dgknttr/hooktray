"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { isMasked } from "@/lib/sensitiveHeaders"

interface Props {
  headers: Record<string, string>
}

export default function HeadersTab({ headers }: Props) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  const entries = Object.entries(headers)

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground p-4">No headers</p>
  }

  return (
    <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
      <colgroup>
        <col style={{ width: "240px" }} />
        <col style={{ width: "minmax(0, 1fr)" }} />
      </colgroup>
      <tbody>
        {entries.map(([key, value]) => {
          const masked = isMasked(key)
          const isRevealed = revealed.has(key)

          return (
            <tr key={key} className="border-b last:border-0">
              <td className="py-2 pr-4 font-mono text-muted-foreground align-top break-all text-xs">
                {key}
              </td>
              <td className="py-2 font-mono break-all text-xs overflow-hidden">
                {masked && !isRevealed ? (
                  <span className="flex items-center gap-2">
                    <span>••••••••</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRevealed((prev) => new Set([...prev, key]))}
                    >
                      Show
                    </Button>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>{value}</span>
                    {masked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setRevealed((prev) => {
                            const next = new Set(prev)
                            next.delete(key)
                            return next
                          })
                        }
                      >
                        Hide
                      </Button>
                    )}
                  </span>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
