"use client"
import { useRef, useEffect } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useRequestStore } from "@/store/requestStore"
import { useConnectionStore } from "@/store/connectionStore"
import { generateCurlExample } from "@/lib/curl"
import RequestListItem from "./RequestListItem"
import type { MethodFilter } from "@/types"

const FILTERS: MethodFilter[] = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"]
const FILTER_LABELS: Record<MethodFilter, string> = {
  ALL: "All",
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DEL",
}

export default function RequestList() {
  const { requests, selectedId, filter, autoScroll, selectRequest, setFilter, setAutoScroll, clearHistory } =
    useRequestStore()
  const { token } = useConnectionStore()

  const topRef = useRef<HTMLDivElement>(null)
  const lastCountRef = useRef(requests.length)

  useEffect(() => {
    if (autoScroll && requests.length > lastCountRef.current) {
      topRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    lastCountRef.current = requests.length
  }, [autoScroll, requests.length])

  const filtered =
    filter === "ALL" ? requests : requests.filter((r) => r.method === filter)

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b space-y-2">
        <ToggleGroup
          value={[filter]}
          onValueChange={(v: string[]) => {
            const last = v[v.length - 1] as MethodFilter | undefined
            if (last) setFilter(last)
          }}
          className="flex flex-wrap gap-1"
        >
          {FILTERS.map((f) => (
            <ToggleGroupItem key={f} value={f} size="sm" className="text-xs font-mono">
              {FILTER_LABELS[f]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            Auto-scroll
          </label>

          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="destructive" size="sm" className="text-xs h-6 px-2" />}
            >
              Clear
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear local history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This only clears requests stored in this browser.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => token && clearHistory(token)}>
                  Clear
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div ref={topRef} />
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p className="text-sm mb-4">Waiting for your first request...</p>
            {token && (
              <pre className="text-xs text-left bg-muted rounded p-3 overflow-x-auto">
                {generateCurlExample(token)}
              </pre>
            )}
          </div>
        ) : (
          filtered.map((r) => (
            <RequestListItem
              key={r.id}
              request={r}
              isSelected={r.id === selectedId}
              onClick={() => selectRequest(r.id)}
            />
          ))
        )}
      </div>

      <div className="border-t px-3 py-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground/60 font-medium">HookTray</span>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/dogukantatar/hooktray"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-150"
          >
            GitHub
          </a>
          <span className="text-muted-foreground/30 text-xs">·</span>
          <span className="text-xs text-muted-foreground/60">Open source</span>
        </div>
      </div>
    </div>
  )
}
