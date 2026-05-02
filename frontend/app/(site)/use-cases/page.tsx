import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Webhook Use Cases - Debug Stripe, GitHub, Shopify & More",
  description:
    "Examples of using HookTray to debug Stripe payment webhooks, GitHub repository events, Shopify order hooks, Slack events, and custom HTTP integrations.",
  openGraph: {
    title: "Webhook Use Cases - Debug Stripe, GitHub, Shopify & More",
    description:
      "Examples of using HookTray to debug Stripe payment webhooks, GitHub repository events, Shopify order hooks, Slack events, and custom HTTP integrations.",
    url: "https://hooktray.com/use-cases",
    type: "website",
  },
  alternates: { canonical: "https://hooktray.com/use-cases" },
}

function CodeBlock({ children }: { readonly children: string }) {
  return (
    <pre className="rounded-lg border border-border bg-muted p-4 text-sm font-mono overflow-x-auto text-muted-foreground">
      {children}
    </pre>
  )
}

export default function UseCasesPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Webhook Use Cases</h1>
      <p className="text-muted-foreground text-lg mb-10">
        HookTray works with any service that sends HTTP webhooks. Here are common
        debugging scenarios with quick-start curl examples.
      </p>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Stripe payment webhooks</h2>
        <p className="text-muted-foreground">
          Stripe sends webhook events for payments, subscriptions, invoices, and more.
          During local development, you can use HookTray to inspect the exact payload
          shape before writing your handler.
        </p>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
          <li>Open HookTray and copy your hook URL.</li>
          <li>In the Stripe Dashboard under Developers &gt; Webhooks, add the hook URL as an endpoint.</li>
          <li>Trigger a test event - HookTray shows the payload and Stripe-Signature header.</li>
        </ol>
        <p className="text-sm text-muted-foreground">Or send a test payload directly with curl:</p>
        <CodeBlock>{`curl -X POST "https://hooktray.com/hooks/YOUR_TOKEN" \\
  -H "content-type: application/json" \\
  -H "stripe-signature: t=1234,v1=abc" \\
  -d '{"type":"payment_intent.succeeded","data":{"object":{"amount":2000}}}'`}</CodeBlock>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">GitHub repository events</h2>
        <p className="text-muted-foreground">
          GitHub webhooks fire on push events, pull requests, issues, releases, and
          dozens of other repository events. Inspect the full payload to understand the
          event structure before building your CI or automation workflow.
        </p>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
          <li>Open HookTray and copy your hook URL.</li>
          <li>In your GitHub repository, go to Settings &gt; Webhooks &gt; Add webhook.</li>
          <li>Paste the hook URL and select the events you want to receive.</li>
          <li>Push a commit or open a PR - the event appears in HookTray instantly.</li>
        </ol>
        <p className="text-sm text-muted-foreground">Simulate a push event with curl:</p>
        <CodeBlock>{`curl -X POST "https://hooktray.com/hooks/YOUR_TOKEN" \\
  -H "content-type: application/json" \\
  -H "x-github-event: push" \\
  -H "x-hub-signature-256: sha256=abc123" \\
  -d '{"ref":"refs/heads/main","repository":{"full_name":"user/repo"}}'`}</CodeBlock>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Shopify order hooks</h2>
        <p className="text-muted-foreground">
          Shopify sends webhooks for orders, fulfilments, customers, and products. Use
          HookTray to inspect order payloads and verify your HMAC validation logic before
          deploying.
        </p>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
          <li>Open HookTray and copy your hook URL.</li>
          <li>In Shopify Admin, go to Settings &gt; Notifications &gt; Webhooks and add the hook URL.</li>
          <li>Select a topic such as orders/create and send a test webhook from Shopify.</li>
        </ol>
        <CodeBlock>{`curl -X POST "https://hooktray.com/hooks/YOUR_TOKEN" \\
  -H "content-type: application/json" \\
  -H "x-shopify-topic: orders/create" \\
  -H "x-shopify-hmac-sha256: abc123" \\
  -d '{"id":1234,"email":"customer@example.com","total_price":"99.00"}'`}</CodeBlock>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Slack events</h2>
        <p className="text-muted-foreground">
          Slack sends HTTP POST requests to your endpoint for app events, slash commands,
          and interactive components. HookTray lets you capture and inspect these payloads
          during development without exposing a public server.
        </p>
        <CodeBlock>{`curl -X POST "https://hooktray.com/hooks/YOUR_TOKEN" \\
  -H "content-type: application/json" \\
  -H "x-slack-signature: v0=abc123" \\
  -d '{"type":"event_callback","event":{"type":"message","text":"hello"}}'`}</CodeBlock>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Any HTTP client</h2>
        <p className="text-muted-foreground">
          HookTray accepts GET, POST, PUT, PATCH, and DELETE. You can inspect webhooks
          from any service or send test requests directly from your terminal.
        </p>
        <CodeBlock>{`# Minimal test
curl -X POST "https://hooktray.com/hooks/YOUR_TOKEN" \\
  -H "content-type: application/json" \\
  -d '{"event":"test","ok":true}'

# With custom headers
curl -X PUT "https://hooktray.com/hooks/YOUR_TOKEN" \\
  -H "x-custom-header: value" \\
  -H "content-type: application/json" \\
  -d '{"id":42}'`}</CodeBlock>
      </section>

      <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
        <Link href="/" className="underline underline-offset-2 hover:text-muted-foreground">
          Open Inspector
        </Link>
        <Link href="/how-it-works" className="underline underline-offset-2 hover:text-muted-foreground">
          How it works
        </Link>
        <Link href="/self-hosting" className="underline underline-offset-2 hover:text-muted-foreground">
          Self-hosting guide
        </Link>
      </div>
    </>
  )
}
