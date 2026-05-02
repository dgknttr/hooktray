import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact & Support — HookTray",
  description:
    "Report bugs, request features, or ask questions about HookTray. Community support via GitHub Issues.",
  openGraph: {
    title: "Contact & Support — HookTray",
    description:
      "Report bugs, request features, or ask questions about HookTray. Community support via GitHub Issues.",
    url: "https://hooktray.com/contact",
    type: "website",
  },
  alternates: { canonical: "https://hooktray.com/contact" },
}

export default function ContactPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Contact & Support</h1>
      <p className="text-muted-foreground text-lg mb-10">
        HookTray is community-supported and open source. Support happens in the open via
        GitHub.
      </p>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Bugs & feature requests</h2>
        <p className="text-muted-foreground">
          Open an issue on GitHub for reproducible bugs or focused feature proposals.
          Please include steps to reproduce for bugs and a clear use case for feature
          requests.
        </p>
        <a
          href="https://github.com/dgknttr/hooktray/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-2 hover:text-muted-foreground transition-colors"
        >
          Open an issue on GitHub →
        </a>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Security vulnerabilities</h2>
        <p className="text-muted-foreground">
          Please do not report security vulnerabilities in public GitHub issues. Follow
          the responsible disclosure process described in the security policy.
        </p>
        <a
          href="https://github.com/dgknttr/hooktray/blob/main/SECURITY.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-2 hover:text-muted-foreground transition-colors"
        >
          Read SECURITY.md →
        </a>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Contributing</h2>
        <p className="text-muted-foreground">
          Pull requests for small, focused, reviewable changes are welcome. Read the
          contributing guide before submitting.
        </p>
        <a
          href="https://github.com/dgknttr/hooktray/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-2 hover:text-muted-foreground transition-colors"
        >
          Read CONTRIBUTING.md →
        </a>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Community guidelines</h2>
        <p className="text-muted-foreground">
          All project spaces follow the code of conduct. Please read it before
          participating.
        </p>
        <a
          href="https://github.com/dgknttr/hooktray/blob/main/CODE_OF_CONDUCT.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-2 hover:text-muted-foreground transition-colors"
        >
          Read CODE_OF_CONDUCT.md →
        </a>
      </section>

      <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
        <Link href="/about" className="underline underline-offset-2 hover:text-muted-foreground">
          About HookTray
        </Link>
        <Link href="/privacy" className="underline underline-offset-2 hover:text-muted-foreground">
          Privacy
        </Link>
      </div>
    </>
  )
}
