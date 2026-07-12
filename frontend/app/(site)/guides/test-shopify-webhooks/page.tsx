import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Shopify Webhook Tester - Inspect Deliveries with a Temporary Endpoint",
  description:
    "Use a temporary endpoint to inspect Shopify webhook deliveries with no account required.",
  openGraph: {
    title: "Shopify Webhook Tester - Inspect Deliveries with a Temporary Endpoint",
    description:
      "Use a temporary endpoint to inspect Shopify webhook deliveries with no account required.",
    url: "https://hooktray.com/guides/test-shopify-webhooks",
    type: "article",
  },
  alternates: { canonical: "https://hooktray.com/guides/test-shopify-webhooks" },
}

const externalLinkClasses = "underline underline-offset-2 hover:text-foreground"

export default function ShopifyWebhookGuidePage() {
  return (
    <>
      <h1 className="mb-4 text-3xl font-bold tracking-tight">How to Test Shopify Webhooks</h1>
      <p className="mb-10 text-lg text-muted-foreground">
        Use a temporary HookTray endpoint to inspect what Shopify delivers in real time. No account
        is required, and request history stays in your browser.
      </p>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Choose a Shopify webhook topic</h2>
        <p className="text-muted-foreground">
          Shopify webhook topics identify the store event that produces a delivery. For example,{ " "}
          <code className="font-mono text-sm">orders/create</code> reports a new order,{ " "}
          <code className="font-mono text-sm">products/update</code> reports a product change, and{ " "}
          <code className="font-mono text-sm">refunds/create</code> reports a newly created refund.
          Subscribe only to topics your integration needs.
        </p>
        <p className="text-sm text-muted-foreground">
          Review Shopify&apos;s topic and subscription model in the{ " "}
          <a
            href="https://shopify.dev/docs/apps/build/webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClasses}
          >
            Shopify webhooks documentation
          </a>
          .
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Subscribe to the topic</h2>
        <p className="text-muted-foreground">
          For app configuration, add a subscription to{ " "}
          <code className="font-mono text-sm">shopify.app.toml</code>. Replace the example URI with
          the temporary HookTray URL you copied:
        </p>
        <pre className="overflow-x-auto border border-border p-4 text-sm text-muted-foreground">
          <code>{`[[webhooks.subscriptions]]
topics = ["orders/create"]
uri = "https://your-temporary-hook-url"`}</code>
        </pre>
        <p className="text-muted-foreground">
          As a programmatic alternative, create the subscription with the GraphQL Admin API. The
          topics and destination URI are configured through your chosen path; do not configure the
          same subscription both ways.
        </p>
        <p className="text-sm text-muted-foreground">
          Follow the{ " "}
          <a
            href="https://shopify.dev/docs/apps/build/webhooks/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClasses}
          >
            Shopify subscription documentation
          </a>{ " "}
          for the current configuration and Admin API workflows.
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Test a real store action</h2>
        <ol className="list-outside list-decimal space-y-3 pl-5 text-muted-foreground">
          <li>
            <Link href="/" className="font-medium text-foreground underline underline-offset-2">
              Open the HookTray inspector
            </Link>{ " "}
            and copy the temporary hook URL.
          </li>
          <li>Choose app configuration or the GraphQL Admin API and subscribe the URL to your topic.</li>
          <li>
            Perform the corresponding real store action, such as creating an order, updating a
            product, or creating a refund.
          </li>
          <li>Return to HookTray and select the captured delivery for inspection.</li>
        </ol>
        <p className="text-muted-foreground">
          A real store action exercises Shopify&apos;s actual event and delivery path, so use it for
          end-to-end confidence in your subscription and workflow.
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Use a Shopify CLI sample trigger</h2>
        <p className="text-muted-foreground">
          A Shopify CLI sample trigger is useful for quickly sending a supported topic to your
          temporary URL. The CLI payload is fixed, and a CLI-triggered webhook is not retried on
          failure. A real store action is needed for end-to-end confidence.
        </p>
        <p className="text-sm text-muted-foreground">
          See the{ " "}
          <a
            href="https://shopify.dev/docs/api/shopify-cli/app/app-webhook-trigger"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClasses}
          >
            Shopify CLI webhook trigger documentation
          </a>{ " "}
          for command options and supported usage.
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Inspect the Shopify delivery</h2>
        <p className="text-muted-foreground">
          Check <code className="font-mono text-sm">X-Shopify-Topic</code> for the delivered topic,{ " "}
          <code className="font-mono text-sm">X-Shopify-Webhook-Id</code> for the unique delivery
          identifier, and <code className="font-mono text-sm">X-Shopify-Hmac-Sha256</code> for the
          signature supplied by Shopify. Inspect the JSON payload in the incoming request. HookTray
          shows the incoming request and returns its acknowledgement.
        </p>
        <p className="text-muted-foreground">
          Inspect response status and timing for your eventual application handler in Shopify
          delivery logs. See the{ " "}
          <a
            href="https://shopify.dev/docs/apps/build/webhooks/troubleshoot"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClasses}
          >
            Shopify delivery logs guidance
          </a>
          .
        </p>
        <p className="border-l-2 border-border pl-4 text-sm text-muted-foreground">
          HookTray displays the HMAC header but does not currently validate it. Your application
          must verify the HMAC against the unmodified raw request body and its Shopify client secret.
          Follow the{ " "}
          <a
            href="https://shopify.dev/docs/apps/build/webhooks/verify-deliveries"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClasses}
          >
            Shopify delivery verification documentation
          </a>
          .
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Troubleshoot Shopify webhook tests</h2>
        <div className="space-y-5 text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground">Raw-body HMAC verification</h3>
            <p>
              HMAC verification requires the raw request body. Parsing or changing its bytes before
              verification can make a valid delivery fail the check.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Duplicate deliveries and idempotency</h3>
            <p>
              A webhook can arrive more than once. Use the Shopify webhook ID as an idempotency key
              so duplicate deliveries do not repeat side effects.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Unordered events</h3>
            <p>
              Shopify does not guarantee delivery order. Design handlers to tolerate related events
              arriving in a different order than they occurred.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Response timeout</h3>
            <p>
              Shopify uses a five-second response timeout. Acknowledge the delivery quickly and move
              longer processing out of the request path in your application.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Retries and repeated failures</h3>
            <p>
              Shopify retries failed HTTPS deliveries up to eight times over four hours. Webhook
              subscriptions created through the Admin API can be automatically deleted after repeated
              failures. Subscriptions declared in app configuration are not automatically deleted for
              delivery failures.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          For current failure and retry details, read the{ " "}
          <a
            href="https://shopify.dev/docs/apps/build/webhooks/troubleshoot"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClasses}
          >
            Shopify webhook troubleshooting documentation
          </a>
          .
        </p>
      </section>

      <div className="flex flex-wrap gap-4 border-t border-border pt-8 text-sm">
        <Link href="/" className="font-medium underline underline-offset-2 hover:text-muted-foreground">
          Open HookTray
        </Link>
        <Link href="/webhook-tester" className="underline underline-offset-2 hover:text-muted-foreground">
          Webhook tester
        </Link>
        <a
          href="https://github.com/dgknttr/hooktray"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-muted-foreground"
        >
          Inspect the source
        </a>
      </div>
    </>
  )
}
