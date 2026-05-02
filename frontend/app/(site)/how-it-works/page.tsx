import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "How HookTray Works — Webhook Relay & SSE Streaming",
  description:
    "Learn how HookTray relays webhooks to your browser using Server-Sent Events, a stateless .NET backend, and IndexedDB for local history.",
  openGraph: {
    title: "How HookTray Works — Webhook Relay & SSE Streaming",
    description:
      "Learn how HookTray relays webhooks to your browser using Server-Sent Events, a stateless .NET backend, and IndexedDB for local history.",
    url: "https://hooktray.com/how-it-works",
    type: "website",
  },
  alternates: { canonical: "https://hooktray.com/how-it-works" },
}

export default function HowItWorksPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-4">How HookTray Works</h1>
      <p className="text-muted-foreground text-lg mb-10">
        HookTray uses a stateless relay backend, Server-Sent Events for live streaming,
        and IndexedDB for browser-local history. No database. No retained payloads.
      </p>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Architecture overview</h2>
        <pre className="rounded-lg border border-border bg-muted p-4 text-sm font-mono overflow-x-auto text-muted-foreground">
{`Webhook provider or curl
        |
        |  ANY /hooks/{token}
        v
.NET Minimal API relay
        |
        |  build bounded request snapshot
        |  broadcast to active SSE subscribers
        v
SSE stream  /api/stream/{token}
        |
        v
Browser UI
        |
        |  render safely (no dangerouslySetInnerHTML)
        |  store locally
        v
IndexedDB`}
        </pre>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Step by step</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-1">1. Token creation</h3>
            <p className="text-muted-foreground text-sm">
              When you open HookTray, the browser calls{" "}
              <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">POST /api/hooks</code>.
              The backend generates a cryptographically secure random token and registers a session.
              The token is used as both the webhook receive path and the SSE channel identifier.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">2. Webhook receive</h3>
            <p className="text-muted-foreground text-sm">
              Your webhook provider sends a request to{" "}
              <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">/hooks/{"{token}"}</code>.
              The backend accepts GET, POST, PUT, PATCH, and DELETE. It builds a bounded snapshot —
              method, path, query string, headers, and a size-limited body preview — and broadcasts
              it to all active SSE subscribers for that token.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">3. SSE stream</h3>
            <p className="text-muted-foreground text-sm">
              The browser opens a persistent connection to{" "}
              <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">/api/stream/{"{token}"}</code>.
              The backend keeps this connection alive and pushes each request snapshot as a JSON SSE
              event. There is no polling — events arrive within milliseconds of the webhook landing.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">4. Local storage</h3>
            <p className="text-muted-foreground text-sm">
              Each incoming snapshot is written to IndexedDB in the browser. History is scoped to
              the token and persists across page reloads. When you reopen HookTray with the same
              token in the URL (
              <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">?t=TOKEN</code>
              ), your previous requests are hydrated from IndexedDB.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">5. Backend cleanup</h3>
            <p className="text-muted-foreground text-sm">
              Sessions that have been inactive beyond the configured TTL are removed by a background
              cleanup task. The backend holds no payload data — only the active session registry and
              subscriber list.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Privacy model</h2>
        <p className="text-muted-foreground">
          The backend is intentionally a relay, not a history service. When a webhook arrives,
          HookTray builds a bounded snapshot, delivers it to your browser, and discards the payload
          server-side. Operational logs use hashed token and IP identifiers — raw values are never
          written. See the{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            privacy page
          </Link>{" "}
          for the full model.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tech stack</h2>
        <ul className="space-y-2 text-muted-foreground text-sm list-disc list-inside">
          <li>
            Backend: .NET 10 Minimal API, in-memory session store,{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">Channel&lt;T&gt;</code>{" "}
            for SSE broadcast
          </li>
          <li>Frontend: Next.js 16 App Router, React 19, Zustand, Dexie (IndexedDB), Tailwind CSS v4</li>
          <li>
            Transport: Server-Sent Events (
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">text/event-stream</code>
            ) — no WebSocket, no polling
          </li>
          <li>Deployment: Docker, nginx reverse proxy, static export for the frontend</li>
        </ul>
      </section>

      <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
        <Link href="/use-cases" className="underline underline-offset-2 hover:text-muted-foreground">
          Use cases
        </Link>
        <Link href="/self-hosting" className="underline underline-offset-2 hover:text-muted-foreground">
          Self-hosting guide
        </Link>
        <Link href="/about" className="underline underline-offset-2 hover:text-muted-foreground">
          About HookTray
        </Link>
      </div>
    </>
  )
}
