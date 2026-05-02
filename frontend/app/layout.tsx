import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

const DEFAULT_SITE_URL = "https://hooktray.com"
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "")

export const metadata: Metadata = {
  title: "HookTray — Webhook Inspector",
  description:
    "Inspect incoming webhooks in real time. No account required. Browser-local request history. Open source and self-hostable.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "HookTray — Webhook Inspector",
    description:
      "Inspect incoming webhooks in real time. No account required. Browser-local request history. Open source and self-hostable.",
    url: siteUrl,
    type: "website",
  },
  alternates: { canonical: siteUrl },
  icons: {
    icon: [{ url: "/hooktray_logo.svg", type: "image/svg+xml" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
