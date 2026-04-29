"use client"
import { Code, Radio, Star } from "lucide-react"
import { generateCurlExample } from "@/lib/curl"

const GITHUB_URL = "https://github.com/dgknttr/hooktray"

interface Props {
  token?: string | null
}

export default function SignalPulseEmptyState({ token }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-10 text-center">
      <div className="relative mb-4 flex size-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
        <span className="absolute inset-2 rounded-full border border-primary/20 animate-pulse" />
        <span className="relative flex size-11 items-center justify-center rounded-full border bg-background shadow-sm">
          <Radio className="size-5 text-primary" />
        </span>
      </div>

      <h2 className="text-base font-semibold">Waiting for first request</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Your hook URL is live. Request details will appear here as soon as a
        webhook arrives.
      </p>

      {token && (
        <pre className="mt-4 w-full max-w-md overflow-x-auto rounded-md bg-muted p-3 text-left text-xs">
          {generateCurlExample(token)}
        </pre>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-medium hover:bg-muted"
        >
          <Code className="size-3.5" />
          GitHub
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-medium hover:bg-muted"
        >
          <Star className="size-3.5" />
          Star on GitHub
        </a>
      </div>
    </div>
  )
}
