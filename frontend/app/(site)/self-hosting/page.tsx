import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Self-host HookTray - Docker & .NET Setup Guide",
  description:
    "Run your own HookTray webhook inspector instance using Docker Compose or the .NET CLI. Full configuration reference included.",
  openGraph: {
    title: "Self-host HookTray - Docker & .NET Setup Guide",
    description:
      "Run your own HookTray webhook inspector instance using Docker Compose or the .NET CLI. Full configuration reference included.",
    url: "https://hooktray.com/self-hosting",
    type: "website",
  },
  alternates: { canonical: "https://hooktray.com/self-hosting" },
}

function CodeBlock({ children }: { readonly children: string }) {
  return (
    <pre className="rounded-lg border border-border bg-muted p-4 text-sm font-mono overflow-x-auto text-muted-foreground">
      {children}
    </pre>
  )
}

export default function SelfHostingPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Self-host HookTray</h1>
      <p className="text-muted-foreground text-lg mb-10">
        HookTray is designed to be self-hosted. The codebase is small, the dependencies
        are minimal, and the configuration is explicit. You can run it with Docker Compose
        in a few minutes.
      </p>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Prerequisites</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Docker and Docker Compose (for the Docker path)</li>
          <li>.NET 10 SDK and Node.js 20+ (for the manual path)</li>
          <li>A domain or reverse proxy if you want HTTPS</li>
        </ul>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Quick start with Docker Compose</h2>
        <p className="text-sm text-muted-foreground">
          Clone the repository, set the deployment environment, and start the production compose file:
        </p>
        <CodeBlock>{`git clone https://github.com/dgknttr/hooktray.git
cd hooktray
printf "DOMAIN=hooktray.example.com\\nTOKEN_SIGNING_KEY=$(openssl rand -base64 32)\\n" > .env
docker compose -f docker-compose.prod.yml --env-file .env up -d`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          The nginx service binds to{" "}
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">127.0.0.1:3000</code>{" "}
          so it can sit behind your host reverse proxy. Point HTTPS traffic for your
          domain at that local port.
        </p>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Manual setup</h2>
        <p className="text-sm font-medium">Backend</p>
        <CodeBlock>{`cd backend
dotnet restore HookTray.sln
dotnet run --project HookTray.Api`}</CodeBlock>
        <p className="text-sm font-medium">Frontend</p>
        <CodeBlock>{`cd frontend
npm ci
NEXT_PUBLIC_API_URL=http://localhost:5221 npm run dev`}</CodeBlock>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Configuration reference</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Backend settings live in{" "}
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
            backend/HookTray.Api/appsettings.json
          </code>
          . All values can be overridden with environment variables.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Setting</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Webhook:MaxBodyBytes", "Maximum accepted webhook payload size"],
                ["Webhook:BodyPreviewLength", "Preview length shown in the request list"],
                ["Session:Ttl", "Session lifetime after inactivity"],
                ["Session:CleanupInterval", "Background cleanup interval"],
                ["RateLimit:MaxWebhooksPerMinute", "Per-token webhook receive limit"],
                ["RateLimit:MaxTokenCreationsPerMinutePerIp", "Token creation limit per IP"],
                ["RateLimit:MaxSessionRestoresPerMinutePerIp", "Same-token SSE restore limit per IP"],
                ["Token:SigningKey", "Production signing key for new hook tokens"],
                ["Cors:AllowedOrigins", "Frontend origins allowed to call the API"],
              ].map(([setting, purpose]) => (
                <tr key={setting} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-mono text-xs">{setting}</td>
                  <td className="py-2">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          Production deployments must provide{" "}
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">Token:SigningKey</code>.
          In Docker Compose, set{" "}
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">TOKEN_SIGNING_KEY</code>.
          The frontend API origin is configured at build time with{" "}
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_API_URL</code>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Behind a reverse proxy</h2>
        <p className="text-muted-foreground text-sm">
          The SSE endpoint (
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">/api/stream/*</code>
          ) requires proxy buffering to be disabled. For nginx, set{" "}
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">proxy_buffering off</code>{" "}
          on that location block. The included{" "}
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">nginx/hooktray.conf.template</code>{" "}
          has this configured correctly.
        </p>
      </section>

      <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
        <a
          href="https://github.com/dgknttr/hooktray"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-muted-foreground"
        >
          GitHub repository
        </a>
        <Link href="/how-it-works" className="underline underline-offset-2 hover:text-muted-foreground">
          How it works
        </Link>
        <Link href="/contact" className="underline underline-offset-2 hover:text-muted-foreground">
          Contact & support
        </Link>
      </div>
    </>
  )
}
