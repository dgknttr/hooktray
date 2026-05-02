"use client"
import Link from "next/link"
import { BookOpen, Code, ListChecks, Radio, Server, ShieldCheck, Star } from "lucide-react"
import { generateCurlExample } from "@/lib/curl"

const GITHUB_URL = "https://github.com/dgknttr/hooktray"
const INFO_CARDS = [
  {
    href: "/how-it-works",
    title: "How it works",
    description: "Stateless relay, SSE streaming, and browser-local history.",
    icon: BookOpen,
  },
  {
    href: "/use-cases",
    title: "Use cases",
    description: "Debug Stripe, GitHub, Shopify, Slack, or any HTTP webhook.",
    icon: ListChecks,
  },
  {
    href: "/self-hosting",
    title: "Self-hosting",
    description: "Run HookTray with Docker, .NET, nginx, and explicit config.",
    icon: Server,
  },
  {
    href: "/privacy",
    title: "Privacy model",
    description: "No server-side payload history by default. Local-first by design.",
    icon: ShieldCheck,
  },
] as const

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

      <div className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
        {INFO_CARDS.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-md border bg-background/70 p-3 text-left transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-7 flex-shrink-0 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground group-hover:text-foreground">
                <Icon className="size-3.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{title}</span>
                <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                  {description}
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
