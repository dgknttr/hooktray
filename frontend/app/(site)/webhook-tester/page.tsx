import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CreditCard, ShoppingBag } from "lucide-react"

import { ExistingHookEndpoint } from "@/components/site/ExistingHookEndpoint"

export const metadata: Metadata = {
  title: "Webhook Tester - Test Webhook Payloads with a Temporary URL",
  description:
    "Test webhooks with a temporary HookTray URL. Send requests from curl, Stripe, GitHub, Shopify, Slack, or custom HTTP clients and inspect them live.",
  openGraph: {
    title: "Webhook Tester - Test Webhook Payloads with a Temporary URL",
    description:
      "Test webhooks with a temporary HookTray URL. Send requests from curl, Stripe, GitHub, Shopify, Slack, or custom HTTP clients and inspect them live.",
    url: "https://hooktray.com/webhook-tester",
    type: "website",
  },
  alternates: { canonical: "https://hooktray.com/webhook-tester" },
}

function CodeBlock({ children }: { readonly children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm font-mono text-muted-foreground">
      {children}
    </pre>
  )
}

export default function WebhookTesterPage() {
  return (
    <>
      <h1 className="mb-4 text-3xl font-bold tracking-tight">Webhook Tester</h1>
      <p className="mb-10 text-lg text-muted-foreground">
        Use HookTray to test webhook requests before your real endpoint is ready.
        Open the inspector, copy the temporary URL, send a request, and review exactly
        what your integration sends.
      </p>

      <ExistingHookEndpoint />

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Quick webhook test</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
          <li>Open HookTray and copy your temporary hook URL.</li>
          <li>Send a request from curl or configure it in your webhook provider.</li>
          <li>Inspect headers, query parameters, body content, and request timing.</li>
        </ol>
        <CodeBlock>{`curl -X POST "https://hooktray.com/hooks/YOUR_TOKEN" \\
  -H "content-type: application/json" \\
  -d '{"event":"test","source":"curl"}'`}</CodeBlock>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Useful for provider setup</h2>
        <p className="text-muted-foreground">
          Webhook providers often differ in event names, signature headers, retry
          behavior, and payload structure. Testing with HookTray helps you see the
          real request before committing code to your application handler.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Verify signature headers are present",
            "Inspect JSON payload shape",
            "Check content type and custom headers",
            "Debug provider test events and retries",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Provider guides</h2>
        <p className="text-muted-foreground">
          Follow provider-specific setup and troubleshooting steps for common webhook platforms.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              href: "/guides/test-stripe-webhooks",
              title: "Test Stripe webhooks",
              description: "Configure Workbench, trigger test events, and inspect Stripe headers and payloads.",
              icon: CreditCard,
            },
            {
              href: "/guides/test-shopify-webhooks",
              title: "Test Shopify webhooks",
              description: "Subscribe to Shopify topics and troubleshoot deliveries, HMAC headers, and retries.",
              icon: ShoppingBag,
            },
          ].map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-md border p-4 transition-colors hover:bg-muted/50"
            >
              <span className="flex items-start gap-3">
                <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground group-hover:text-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 font-medium">
                    {title}
                    <ArrowRight className="size-4 flex-shrink-0 text-muted-foreground" />
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {description}
                  </span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8 text-sm">
        <Link href="/" className="underline underline-offset-2 hover:text-muted-foreground">
          Start testing
        </Link>
        <Link href="/use-cases" className="underline underline-offset-2 hover:text-muted-foreground">
          Webhook use cases
        </Link>
        <Link href="/privacy" className="underline underline-offset-2 hover:text-muted-foreground">
          Privacy model
        </Link>
      </div>
    </>
  )
}
