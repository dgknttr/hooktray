import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Stripe Webhook Tester - Test Events with a Temporary Endpoint",
  description:
    "Use a temporary endpoint to inspect Stripe webhooks in real time with no account required.",
  openGraph: {
    title: "Stripe Webhook Tester - Test Events with a Temporary Endpoint",
    description:
      "Use a temporary endpoint to inspect Stripe webhooks in real time with no account required.",
    url: "https://hooktray.com/guides/test-stripe-webhooks",
    type: "article",
  },
  alternates: { canonical: "https://hooktray.com/guides/test-stripe-webhooks" },
}

const externalLinkClasses = "underline underline-offset-2 hover:text-foreground"

export default function StripeWebhookGuidePage() {
  return (
    <>
      <h1 className="mb-4 text-3xl font-bold tracking-tight">How to Test Stripe Webhooks</h1>
      <p className="mb-10 text-lg text-muted-foreground">
        Use a temporary HookTray endpoint to inspect Stripe webhook requests in real time.
        No account is required, and request history stays in your browser.
      </p>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">What Stripe webhooks send</h2>
        <p className="text-muted-foreground">
          Stripe webhooks are HTTP requests that notify your application when an event occurs
          in Stripe. Events can include <code className="font-mono text-sm">payment_intent.succeeded</code>,{" "}
          <code className="font-mono text-sm">invoice.paid</code>, and{" "}
          <code className="font-mono text-sm">customer.subscription.updated</code>, among many others.
          The event types you need depend on your integration.
        </p>
        <p className="text-sm text-muted-foreground">
          For the complete model and delivery behavior, read the{" "}
          <a
            href="https://docs.stripe.com/webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClasses}
          >
            Stripe webhook documentation
          </a>
          .
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Set up a test destination in Stripe Workbench</h2>
        <ol className="list-outside list-decimal space-y-3 pl-5 text-muted-foreground">
          <li>
            <Link href="/" className="font-medium text-foreground underline underline-offset-2">
              Open the HookTray inspector
            </Link>{" "}
            and copy the generated hook URL shown in the inspector.
          </li>
          <li>Open Stripe Dashboard, switch to test mode, and go to Workbench.</li>
          <li>Open Webhooks, create a new event destination, and choose your Stripe account as the source.</li>
          <li>Select the event types your integration needs, then continue to the destination settings.</li>
          <li>Choose a webhook endpoint and paste your generated HookTray URL as the endpoint URL.</li>
          <li>Create the destination. Use Workbench to inspect its configuration and delivery attempts.</li>
          <li>
            Trigger a subscribed event by performing the corresponding test-mode action in Stripe
            Dashboard or with Stripe CLI, for example:{" "}
            <code className="font-mono text-sm">stripe trigger payment_intent.succeeded</code>.
          </li>
          <li>Return to HookTray and select the incoming request to inspect it.</li>
        </ol>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Inspect the request</h2>
        <p className="text-muted-foreground">
          In HookTray, confirm that the <code className="font-mono text-sm">Stripe-Signature</code>{" "}
          header is present and inspect the <code className="font-mono text-sm">Content-Type</code> header.
          In the JSON request body, check the event type in <code className="font-mono text-sm">type</code>,
          the event ID in <code className="font-mono text-sm">id</code>, and the object under{" "}
          <code className="font-mono text-sm">data</code>.
        </p>
        <p className="border-l-2 border-border pl-4 text-sm text-muted-foreground">
          HookTray displays the signature header but does not validate the signature. Verify signatures
          in your application using the endpoint secret and the unmodified raw request body. See the{" "}
          <a
            href="https://docs.stripe.com/webhooks/signature"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClasses}
          >
            Stripe signature documentation
          </a>{" "}
          for the official procedure.
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Troubleshooting Stripe webhook tests</h2>
        <div className="space-y-5 text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground">Wrong endpoint secret</h3>
            <p>Each webhook endpoint has its own signing secret. Use the secret for the exact destination and mode receiving the event.</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Raw body mutation</h3>
            <p>Parsing, reformatting, or otherwise changing the body before verification can cause signature checks in your application to fail. Preserve the raw request bytes.</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Test and live mode confusion</h3>
            <p>Test-mode and live-mode destinations, events, and secrets are separate. Confirm the Dashboard mode matches the integration you are debugging.</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Non-2xx responses</h3>
            <p>Stripe treats a response outside the 2xx range as a failed delivery. Check the destination URL and your application response when moving from inspection to your own handler.</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Retries and duplicate deliveries</h3>
            <p>Stripe can retry failed deliveries, so your application should handle the same event ID more than once without repeating side effects.</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Unordered events</h3>
            <p>Events are not guaranteed to arrive in the order they were created. Build handlers that do not depend on delivery order.</p>
          </div>
        </div>
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
