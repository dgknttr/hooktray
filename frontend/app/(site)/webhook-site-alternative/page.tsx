import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Webhook.site Alternative - Open Source Webhook Inspector",
  description:
    "Looking for a Webhook.site alternative? HookTray is an open-source, local-first webhook inspector with browser-local history and no account required.",
  openGraph: {
    title: "Webhook.site Alternative - Open Source Webhook Inspector",
    description:
      "Looking for a Webhook.site alternative? HookTray is an open-source, local-first webhook inspector with browser-local history and no account required.",
    url: "https://hooktray.com/webhook-site-alternative",
    type: "website",
  },
  alternates: { canonical: "https://hooktray.com/webhook-site-alternative" },
}

export default function WebhookSiteAlternativePage() {
  return (
    <>
      <h1 className="mb-4 text-3xl font-bold tracking-tight">Webhook.site Alternative</h1>
      <p className="mb-10 text-lg text-muted-foreground">
        HookTray is an open-source webhook inspector for developers who want a
        no-account debugging flow, browser-local request history, and a backend that
        acts as a stateless relay instead of a long-term payload store.
      </p>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Why choose HookTray?</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left font-medium">Capability</th>
                <th className="py-2 text-left font-medium text-muted-foreground">HookTray approach</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Account requirement", "No account required for the core inspector flow"],
                ["Request history", "Stored in your browser with IndexedDB"],
                ["Server payload retention", "No server-side request history by default"],
                ["Source code", "Open source, auditable, and self-hostable"],
                ["Transport", "Live streaming with Server-Sent Events"],
              ].map(([capability, approach]) => (
                <tr key={capability} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-medium text-foreground">{capability}</td>
                  <td className="py-2">{approach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Best fit</h2>
        <p className="text-muted-foreground">
          HookTray is best when you want fast webhook debugging, transparent source
          code, and a privacy model that keeps payload history out of server storage
          by default. It is intentionally small and focused on the live inspection loop.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8 text-sm">
        <Link href="/" className="underline underline-offset-2 hover:text-muted-foreground">
          Open HookTray
        </Link>
        <Link href="/webhook-inspector" className="underline underline-offset-2 hover:text-muted-foreground">
          Webhook inspector
        </Link>
        <Link href="/self-hosting" className="underline underline-offset-2 hover:text-muted-foreground">
          Self-hosting
        </Link>
      </div>
    </>
  )
}
