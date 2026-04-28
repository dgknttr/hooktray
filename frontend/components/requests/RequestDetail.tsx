"use client"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import HeadersTab from "./HeadersTab"
import BodyTab from "./BodyTab"
import { useRelativeTime } from "@/hooks/useRelativeTime"
import { formatBytes } from "@/lib/format"
import type { RequestSnapshotWire } from "@/types"

interface Props {
  request: RequestSnapshotWire
}

interface SectionProps {
  title: string
  badge?: number
  defaultOpen?: boolean
  children: React.ReactNode
}

function Section({ title, badge, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted/40 transition-colors duration-150 cursor-pointer"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
        )}
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {badge !== undefined && badge > 0 && (
          <span className="ml-1 text-xs text-muted-foreground/60">({badge})</span>
        )}
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}

export default function RequestDetail({ request }: Props) {
  const relativeTime = useRelativeTime(request.receivedAt)
  const contentType = request.headers["content-type"] ?? request.headers["Content-Type"] ?? null
  const queryEntries = Object.entries(request.queryParams)
  const headerCount = Object.keys(request.headers).length

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* sticky top metadata bar */}
      <div className="border-b px-4 py-2.5 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-sm font-semibold flex-shrink-0">{request.method}</span>
          <span className="font-mono text-sm truncate text-muted-foreground flex-1">
            {request.path}
            {request.rawQueryString ? `?${request.rawQueryString}` : ""}
          </span>
          <span className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground/70">
            <span>{formatBytes(request.sizeBytes)}</span>
            <span className="opacity-50">·</span>
            <span>{relativeTime}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Overview */}
        <Section title="Overview">
          <dl className="px-4 pb-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs font-mono">
            <dt className="text-muted-foreground">Method</dt>
            <dd>{request.method}</dd>
            <dt className="text-muted-foreground">Path</dt>
            <dd className="break-all">{request.path}</dd>
            <dt className="text-muted-foreground">Size</dt>
            <dd>{formatBytes(request.sizeBytes)}</dd>
            <dt className="text-muted-foreground">Received</dt>
            <dd>{new Date(request.receivedAt).toLocaleString()}</dd>
            {contentType && (
              <>
                <dt className="text-muted-foreground">Content-Type</dt>
                <dd className="break-all">{contentType}</dd>
              </>
            )}
          </dl>
        </Section>

        {/* Headers */}
        <Section title="Headers" badge={headerCount}>
          <div className="px-4 pb-3">
            <HeadersTab headers={request.headers} />
          </div>
        </Section>

        {/* Body */}
        <Section title="Body">
          <BodyTab body={request.body} isBase64Encoded={request.isBase64Encoded} />
        </Section>

        {/* Query Params */}
        {queryEntries.length > 0 ? (
          <Section title="Query Params" badge={queryEntries.length}>
            <table className="w-full text-xs font-mono px-4 mb-3">
              <tbody>
                {queryEntries.map(([key, value]) => (
                  <tr key={key} className="border-b last:border-0">
                    <td className="px-4 py-1.5 text-muted-foreground w-1/3 break-all align-top">{key}</td>
                    <td className="py-1.5 pr-4 break-all">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        ) : (
          <div className="px-4 py-2.5 border-b last:border-0">
            <span className="text-xs text-muted-foreground/50 uppercase tracking-wider font-semibold">Query Params</span>
            <span className="text-xs text-muted-foreground/40 ml-2">none</span>
          </div>
        )}
      </div>
    </div>
  )
}
