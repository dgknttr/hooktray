import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "HookTray Privacy — Local-first by Design",
  description:
    "HookTray does not store webhook payloads on the server by default. Request history is kept in your browser with IndexedDB. No account, no tracking.",
  openGraph: {
    title: "HookTray Privacy — Local-first by Design",
    description:
      "HookTray does not store webhook payloads on the server by default. Request history is kept in your browser with IndexedDB. No account, no tracking.",
    url: "https://hooktray.com/privacy",
    type: "website",
  },
  alternates: { canonical: "https://hooktray.com/privacy" },
}

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Privacy by Design</h1>
      <p className="text-muted-foreground text-lg mb-10">
        HookTray&apos;s privacy model is part of the product, not an afterthought.
        The backend is a relay, not a storage service.
      </p>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">What the server stores</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
          <li>An active session registry — token hashes and TTL metadata — kept in memory only, not on disk.</li>
          <li>Active SSE subscriber connections, cleared on disconnect.</li>
          <li>
            Operational logs with privacy-preserving fields only: hashed token, hashed IP, HTTP
            method, path, payload size in bytes, delivery status, and timestamp.
          </li>
        </ul>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">What the server never stores</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
          <li>Webhook request bodies or payloads</li>
          <li>Header values (including authentication headers and signatures)</li>
          <li>Raw token values</li>
          <li>Raw IP addresses</li>
          <li>Any personally identifiable information</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          When a webhook arrives, the backend builds a bounded snapshot and broadcasts it to active
          SSE subscribers. The payload is discarded server-side immediately after delivery.
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Browser-local history</h2>
        <p className="text-muted-foreground text-sm">
          Request history is stored in your browser using IndexedDB via the Dexie library. This
          data stays on your device. Clearing your browser&apos;s site data for hooktray.com removes
          all stored history. No history is sent back to the server.
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Hook URLs are temporary secrets</h2>
        <p className="text-muted-foreground text-sm">
          Your hook URL contains a token that identifies your session. Treat it like a temporary
          credential — anyone with the URL can send requests to it. Sessions expire after a
          configurable period of inactivity. Do not share hook URLs in public logs or screenshots.
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">No account, no tracking</h2>
        <p className="text-muted-foreground text-sm">
          HookTray does not require an account. There are no cookies set for authentication, no
          analytics scripts loaded on the inspector, and no user profiles. The only browser storage
          used is IndexedDB for request history and localStorage for the active token and theme
          preference.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Full privacy policy</h2>
        <p className="text-muted-foreground text-sm">
          The complete privacy policy is maintained in the repository:{" "}
          <a
            href="https://github.com/dgknttr/hooktray/blob/main/PRIVACY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            PRIVACY.md on GitHub →
          </a>
        </p>
      </section>

      <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
        <Link href="/about" className="underline underline-offset-2 hover:text-muted-foreground">
          About HookTray
        </Link>
        <Link href="/contact" className="underline underline-offset-2 hover:text-muted-foreground">
          Contact
        </Link>
        <Link href="/how-it-works" className="underline underline-offset-2 hover:text-muted-foreground">
          How it works
        </Link>
      </div>
    </>
  )
}
