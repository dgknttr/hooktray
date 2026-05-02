import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About HookTray — Open Source Webhook Inspector",
  description:
    "Learn about HookTray, a local-first, open-source webhook inspector built for developers who care about privacy.",
  openGraph: {
    title: "About HookTray — Open Source Webhook Inspector",
    description:
      "Learn about HookTray, a local-first, open-source webhook inspector built for developers who care about privacy.",
    url: "https://hooktray.com/about",
    type: "website",
  },
  alternates: { canonical: "https://hooktray.com/about" },
}

export default function AboutPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-4">About HookTray</h1>
      <p className="text-muted-foreground mb-10 text-lg">
        A local-first webhook inspector for developers who want to debug integrations
        without trusting a third-party service with their payload data.
      </p>

      <section className="space-y-4 mb-12">
        <h2 className="text-xl font-semibold">What is HookTray?</h2>
        <p className="text-muted-foreground">
          HookTray is an open-source webhook debugging tool. You create a temporary
          webhook URL, point any HTTP client at it, and watch requests appear in your
          browser in real time via Server-Sent Events. Request history is stored locally
          in IndexedDB — nothing lands on a server by default.
        </p>
        <p className="text-muted-foreground">
          The core loop is: open the inspector, get a URL, send a webhook, inspect the
          request. No account, no sign-up, no data retention on the server side.
        </p>
      </section>

      <section className="space-y-4 mb-12">
        <h2 className="text-xl font-semibold">Why it was built</h2>
        <p className="text-muted-foreground">
          Webhook debugging tools are convenient but they often ask you to trust a hosted
          service with payloads that may contain customer IDs, HMAC signatures, order
          data, or authentication tokens. HookTray takes a narrower path: the backend is
          a stateless relay. It forwards the request to your browser and discards it.
          Your browser stores the history, not a remote database.
        </p>
      </section>

      <section className="space-y-4 mb-12">
        <h2 className="text-xl font-semibold">Core principles</h2>
        <ul className="space-y-2 text-muted-foreground list-disc list-inside">
          <li>No account required for the core debugging flow</li>
          <li>No server-side request history by default</li>
          <li>Browser-local storage with IndexedDB</li>
          <li>Stateless relay backend — not a request history service</li>
          <li>Privacy-preserving operational logs</li>
          <li>Small codebase designed to be read, forked, and self-hosted</li>
        </ul>
      </section>

      <section className="space-y-4 mb-12">
        <h2 className="text-xl font-semibold">Who it is for</h2>
        <p className="text-muted-foreground">
          HookTray is useful if you want to debug webhook integrations during local or
          staging development, inspect requests from Stripe, GitHub, Shopify, Slack, or
          custom services, or run a lightweight relay without a database. It is also a
          good reference implementation if you want to study a local-first approach to
          request inspection.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Source code</h2>
        <p className="text-muted-foreground">
          HookTray is MIT-licensed and hosted on GitHub.{" "}
          <a
            href="https://github.com/dgknttr/hooktray"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            View the repository →
          </a>
        </p>
      </section>

      <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
        <Link href="/how-it-works" className="underline underline-offset-2 hover:text-muted-foreground">
          How it works
        </Link>
        <Link href="/self-hosting" className="underline underline-offset-2 hover:text-muted-foreground">
          Self-hosting guide
        </Link>
        <Link href="/privacy" className="underline underline-offset-2 hover:text-muted-foreground">
          Privacy model
        </Link>
      </div>
    </>
  )
}
