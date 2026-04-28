"use client"
import { useState, useEffect } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/app/providers"

interface Props {
  body: string | null
  isBase64Encoded: boolean
}

function isJson(s: string): boolean {
  try {
    JSON.parse(s)
    return true
  } catch {
    return false
  }
}

export default function BodyTab({ body, isBase64Encoded }: Props) {
  const { resolvedTheme } = useTheme()
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const jsonBody = body && !isBase64Encoded && isJson(body) ? body : null

  useEffect(() => {
    if (!jsonBody) return
    let cancelled = false
    import("shiki").then(({ createHighlighter }) =>
      createHighlighter({ themes: ["github-light", "github-dark"], langs: ["json"] })
    ).then((hl) => {
      if (cancelled) return
      setHighlighted(
        hl.codeToHtml(jsonBody, {
          lang: "json",
          theme: resolvedTheme === "dark" ? "github-dark" : "github-light",
        })
      )
    }).catch(() => {})
    return () => { cancelled = true }
  }, [jsonBody, resolvedTheme])

  async function handleCopy() {
    if (!body) return
    await navigator.clipboard.writeText(body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!body) {
    return <p className="text-sm text-muted-foreground p-4">No body</p>
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2 z-10"
        onClick={handleCopy}
        aria-label="copy body"
      >
        {copied ? "Copied!" : <><Copy className="h-3.5 w-3.5 mr-1" />Copy body</>}
      </Button>

      {isBase64Encoded ? (
        <p className="text-sm text-muted-foreground p-4">
          Binary content (base64 encoded)
        </p>
      ) : highlighted ? (
        <div
          className="overflow-auto text-sm [&_pre]:p-4"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      ) : (
        <pre className="p-4 text-sm overflow-auto whitespace-pre-wrap break-all">
          {body}
        </pre>
      )}
    </div>
  )
}
