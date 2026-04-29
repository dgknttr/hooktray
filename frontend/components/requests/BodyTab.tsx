"use client"
import { useState } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatJsonBody } from "@/lib/format"

interface Props {
  body: string | null
  isBase64Encoded: boolean
}

type BodyViewMode = "raw" | "pretty"

export default function BodyTab({ body, isBase64Encoded }: Props) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<BodyViewMode>("raw")

  if (!body) {
    return <p className="text-sm text-muted-foreground p-4">No body</p>
  }

  const prettyBody = !isBase64Encoded ? formatJsonBody(body) : null
  const canPrettyPrint = prettyBody !== null
  const activeViewMode = viewMode === "pretty" && canPrettyPrint ? "pretty" : "raw"
  const visibleBody = activeViewMode === "pretty" ? prettyBody ?? body : body

  async function handleCopy() {
    await navigator.clipboard.writeText(visibleBody)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-2 border-b px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          value={[activeViewMode]}
          onValueChange={(value: string[]) => {
            const next = value[value.length - 1] as BodyViewMode | undefined
            if (next) setViewMode(next)
          }}
          className="flex w-full flex-wrap gap-1 sm:w-fit"
          aria-label="body view mode"
        >
          <ToggleGroupItem value="raw" size="sm" className="text-xs">
            Raw
          </ToggleGroupItem>
          <ToggleGroupItem
            value="pretty"
            size="sm"
            className="text-xs"
            disabled={!canPrettyPrint}
          >
            Pretty
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center sm:w-fit"
          onClick={handleCopy}
          aria-label="copy body"
        >
          {copied ? (
            "Copied!"
          ) : (
            <>
              <Copy className="size-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      {isBase64Encoded ? (
        <p className="text-sm text-muted-foreground p-4">
          Binary content (base64 encoded)
        </p>
      ) : (
        <pre className="overflow-auto whitespace-pre-wrap break-words p-4 text-sm">
          {visibleBody}
        </pre>
      )}
    </div>
  )
}
