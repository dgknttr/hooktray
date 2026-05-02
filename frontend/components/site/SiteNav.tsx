import Link from "next/link"

export function SiteNav() {
  return (
    <header className="border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-foreground shrink-0">
          HookTray
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/how-it-works" className="hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="/use-cases" className="hover:text-foreground transition-colors">
            Use cases
          </Link>
          <Link href="/self-hosting" className="hover:text-foreground transition-colors">
            Self-hosting
          </Link>
          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
        <Link
          href="/"
          className="shrink-0 text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Open Inspector
        </Link>
      </div>
    </header>
  )
}
