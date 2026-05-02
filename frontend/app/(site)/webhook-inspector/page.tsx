import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Webhook Inspector - Inspect HTTP Webhooks in Real Time",
  description:
    "Use HookTray as a webhook inspector for live debugging. Capture HTTP requests, inspect headers and bodies, and keep request history in your browser.",
  openGraph: {
    title: "Webhook Inspector - Inspect HTTP Webhooks in Real Time",
    description:
      "Use HookTray as a webhook inspector for live debugging. Capture HTTP requests, inspect headers and bodies, and keep request history in your browser.",
    url: "https://hooktray.com/webhook-inspector",
    type: "website",
  },
  alternates: { canonical: "https://hooktray.com/webhook-inspector" },
}

function CodeBlock({ children }: { readonly children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm font-mono text-muted-foreground">
      {children}
    </pre>
  )
}

export default function WebhookInspectorPage() {
  return (
    <>
      <h1 className="mb-4 text-3xl font-bold tracking-tight">Webhook Inspector</h1>
      <p className="mb-10 text-lg text-muted-foreground">
        HookTray gives you a temporary webhook URL and streams every incoming HTTP
        request into your browser. Inspect methods, paths, query strings, headers,
        and body previews without creating an account.
      </p>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Inspect requests as they arrive</h2>
        <p className="text-muted-foreground">
          Point Stripe, GitHub, Shopify, Slack, or any HTTP client at your HookTray
          URL. Each request appears in the inspector over Server-Sent Events, so you
          can debug payload shape, signatures, and provider behavior while you work.
        </p>
        <CodeBlock>{`curl -X POST "https://hooktray.com/hooks/YOUR_TOKEN" \\
  -H "content-type: application/json" \\
  -H "x-provider-event: test" \\
  -d '{"event":"webhook.created","ok":true}'`}</CodeBlock>
      </section>

      <section className="mb-12 grid gap-4 sm:grid-cols-3">
        {[
          ["Live stream", "Requests are delivered to your active browser session with SSE."],
          ["Local history", "Captured request history is stored in your browser with IndexedDB."],
          ["Open source", "The code is MIT-licensed, auditable, and self-hostable."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-lg border border-border p-4">
            <h3 className="font-medium">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        ))}
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Privacy-first by default</h2>
        <p className="text-muted-foreground">
          HookTray is a relay, not a server-side request history service. The backend
          builds a bounded request snapshot, broadcasts it to active subscribers, and
          does not persist webhook payloads by default.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8 text-sm">
        <Link href="/" className="underline underline-offset-2 hover:text-muted-foreground">
          Open inspector
        </Link>
        <Link href="/webhook-tester" className="underline underline-offset-2 hover:text-muted-foreground">
          Webhook tester
        </Link>
        <Link href="/how-it-works" className="underline underline-offset-2 hover:text-muted-foreground">
          How HookTray works
        </Link>
      </div>
    </>
  )
}
