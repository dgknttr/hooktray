"use client"
import { Inbox, Rows3 } from "lucide-react"

const PLACEHOLDER_ROWS = [
  { number: "#3", method: "POST", path: "/webhooks/order", surface: "bg-background/90" },
  { number: "#2", method: "GET", path: "/health/check", surface: "bg-muted/30" },
  { number: "#1", method: "POST", path: "/stripe/events", surface: "bg-muted/20" },
]

export default function RequestListEmptyState() {
  return (
    <div className="flex h-full flex-col justify-center px-3 py-6">
      <div className="rounded-md border border-dashed bg-muted/20 p-3">
        <div className="flex items-start gap-2">
          <span className="flex size-8 flex-shrink-0 items-center justify-center rounded-md border bg-background">
            <Inbox className="size-4 text-muted-foreground" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold">Request queue ready</p>
              <Rows3 className="size-3.5 text-muted-foreground" />
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Incoming webhooks will appear here in arrival order.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2" aria-hidden="true">
          {PLACEHOLDER_ROWS.map((row) => (
            <div
              key={row.number}
              className={`rounded-md border px-2.5 py-2 ${row.surface}`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="w-7 flex-shrink-0 text-right font-mono text-xs text-muted-foreground">
                  {row.number}
                </span>
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold">
                  {row.method}
                </span>
                <span className="truncate font-mono text-xs text-muted-foreground">
                  {row.path}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
