import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "HookTray — Webhook Inspector",
  description: "Inspect incoming webhooks in real time",
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
