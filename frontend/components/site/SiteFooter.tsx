import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>Copyright 2026 Dogukan Tatar. MIT-licensed open source software.</p>
        <nav className="flex items-center gap-5">
          <a
            href="https://github.com/dgknttr/hooktray"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
          <a
            href="https://github.com/dgknttr/hooktray/blob/main/TRADEMARK.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Trademark
          </a>
        </nav>
      </div>
    </footer>
  )
}
