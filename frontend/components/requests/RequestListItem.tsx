"use client"
import { useEffect, useState } from "react"
import { useRelativeTime } from "@/hooks/useRelativeTime"
import { formatBytes } from "@/lib/format"
import type { RequestSnapshotWire } from "@/types"
import { cn } from "@/lib/utils"

const NEW_WINDOW_MS = 300

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  POST: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  PUT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  PATCH: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

interface Props {
  request: RequestSnapshotWire
  isSelected: boolean
  isNew?: boolean
  onClick: () => void
}

export default function RequestListItem({ request, isSelected, isNew, onClick }: Props) {
  const relativeTime = useRelativeTime(request.receivedAt)
  const methodColor = METHOD_COLORS[request.method] ?? "bg-gray-100 text-gray-700"
  const [isRecentlyAdded, setIsRecentlyAdded] = useState(
    () => Date.now() - new Date(request.receivedAt).getTime() < NEW_WINDOW_MS
  )
  const showNew = isNew ?? isRecentlyAdded

  useEffect(() => {
    if (isNew !== undefined || !isRecentlyAdded) return
    const timeout = window.setTimeout(() => setIsRecentlyAdded(false), NEW_WINDOW_MS)
    return () => window.clearTimeout(timeout)
  }, [isNew, isRecentlyAdded])

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={cn(
        "relative flex flex-col gap-0.5 px-3 py-2.5 cursor-pointer hover:bg-accent transition-colors duration-150",
        isSelected && "bg-accent"
      )}
    >
      {showNew && (
        <span className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-primary animate-ping" />
      )}
      {/* Row 1: method badge + path */}
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            "flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-mono font-semibold leading-tight",
            methodColor
          )}
        >
          {request.method}
        </span>
        <span className="truncate text-sm font-mono">{request.path}</span>
      </div>
      {/* Row 2: size · relative time */}
      <div className="flex items-center gap-1 pl-0.5 text-xs text-muted-foreground">
        <span>{formatBytes(request.sizeBytes)}</span>
        <span className="opacity-40">·</span>
        <span>{relativeTime}</span>
      </div>
    </div>
  )
}
