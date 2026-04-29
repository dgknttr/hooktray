# HookTray

[![CI](https://github.com/dgknttr/hooktray/actions/workflows/ci.yml/badge.svg)](https://github.com/dgknttr/hooktray/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-early_preview-f59e0b.svg)](#project-status)
[![Local-first](https://img.shields.io/badge/local--first-browser_history-10b981.svg)](#privacy-model)

HookTray is a local-first webhook inspector for live debugging.

Create a temporary webhook URL, point Stripe, GitHub, Shopify, or any HTTP client at it, and watch requests stream into your browser in real time. HookTray keeps request history in the browser by default and does not build server-side payload history by default.

30-second pitch: open HookTray, get a URL, send a webhook, inspect the request, keep the debugging history local.

## Why HookTray?

Webhook debugging tools are convenient, but they often ask you to trust a hosted service with payloads that may contain customer IDs, signatures, emails, tokens, order data, or other sensitive integration details.

HookTray takes a narrower path:

- no account required for the core debugging flow
- no server-side request history by default
- request history stored in your browser with IndexedDB
- stateless relay backend for live delivery
- Server-Sent Events instead of polling
- privacy-preserving logs by default
- small codebase designed to be forked, audited, and self-hosted

## Who This Is For

Use HookTray if you want to:

- debug webhooks during local or staging development
- inspect incoming requests from providers like Stripe, GitHub, Shopify, Slack, or custom services
- run a lightweight webhook relay without a database
- study a local-first approach to request inspection
- fork a simple implementation and adapt it to your own workflow

HookTray is a poor fit today if you need:

- shared team workspaces
- long-term server-side request retention
- request replay or forwarding
- custom domains
- production webhook monitoring
- built-in accounts, billing, or organization management

Those capabilities are not forbidden forever, but they change the trust model and must be designed explicitly before they land.

## Project Status

HookTray is in early preview. The current goal is to make the core live debugging loop small, understandable, and trustworthy before adding broader platform features.

| Capability | Status | Notes |
| --- | --- | --- |
| Temporary hook URL | Supported | `POST /api/hooks` creates a session token |
| Webhook receive endpoint | Supported | `ANY /hooks/{token}` accepts common HTTP methods |
| Live browser stream | Supported | SSE endpoint emits request events |
| Browser-local history | Supported | IndexedDB stores token-scoped history |
| Sensitive header masking | Supported | Frontend masks common sensitive headers by default |
| Rate limiting | Supported | Token creation and webhook receive limits |
| Server-side payload history | Not in scope | Not stored by default |
| Request replay | Not in scope | Future proposal only |
| Request forwarding | Not in scope | Future proposal only |
| Accounts and billing | Not in scope | Future proposal only |

## Quickstart

### Prerequisites

- .NET 10 SDK
- Node.js 20 or newer
- npm

### 1. Start the backend

```bash
cd backend
dotnet restore HookTray.sln
dotnet run --project HookTray.Api
```

The API defaults to `http://localhost:5221` with the included ASP.NET Core launch settings.

### 2. Start the frontend

```bash
cd frontend
npm ci
NEXT_PUBLIC_API_URL=http://localhost:5221 npm run dev
```

Open `http://localhost:3000`.

### 3. Send a test webhook

Create a hook in the UI, copy the generated hook URL, then send a request:

```bash
curl -X POST "http://localhost:5221/hooks/YOUR_TOKEN" \
  -H "content-type: application/json" \
  -d '{"event":"hooktray.test","ok":true}'
```

The request should appear in the browser immediately.

## How It Works

```text
Webhook provider or curl
        |
        |  ANY /hooks/{token}
        v
.NET Minimal API relay
        |
        |  build request snapshot
        |  broadcast to active subscribers
        v
SSE stream /api/stream/{token}
        |
        v
Browser UI
        |
        |  render safely
        |  store locally
        v
IndexedDB
```

The backend is intentionally a relay, not a request-history service. When a webhook arrives, HookTray builds a bounded snapshot, broadcasts it to active browser subscribers, and discards the payload server-side by default.

## Privacy Model

HookTray's default privacy model is part of the product, not an implementation detail.

- Webhook payloads are not persisted server-side by default.
- Browser request history is stored locally in IndexedDB.
- Hook URLs are temporary secrets and should be treated like credentials.
- Logs must not include raw tokens, raw IP addresses, request bodies, header values, full payloads, or sensitive credentials.
- Operational logs should use privacy-preserving metadata such as hashed token, hashed IP, method, path, payload size, delivery status, and timestamp.

See [PRIVACY.md](PRIVACY.md) and [SECURITY.md](SECURITY.md).

## Architecture

```text
backend/
  HookTray.Api/          Minimal API relay, sessions, rate limits, SSE
  HookTray.Api.Tests/    Unit and endpoint tests

frontend/
  app/                   Next.js App Router shell
  components/            Layout and request inspection UI
  lib/                   API, SSE, IndexedDB, formatting, privacy helpers
  store/                 Zustand stores for connection and requests
  types/                 Shared frontend types
```

Core backend responsibilities are kept separate:

- token generation
- token and IP hashing
- session storage
- subscriber management
- per-token and per-IP rate limiting
- request snapshot building
- SSE streaming
- background cleanup

## Configuration

Backend defaults live in `backend/HookTray.Api/appsettings.json`.

| Setting | Purpose |
| --- | --- |
| `Webhook:MaxBodyBytes` | Maximum accepted webhook payload size |
| `Webhook:BodyPreviewLength` | Preview length for request lists |
| `Session:Ttl` | Session lifetime after inactivity |
| `Session:CleanupInterval` | Background cleanup interval |
| `RateLimit:MaxWebhooksPerMinute` | Per-token webhook receive limit |
| `RateLimit:MaxTokenCreationsPerMinutePerIp` | Token creation limit |
| `RateLimit:MaxSessionRestoresPerMinutePerIp` | Same-token SSE session restore limit |
| `Token:SigningKey` | Production signing key for new hook tokens |
| `Cors:AllowedOrigins` | Frontend origins allowed to call the API |

Production deployments must provide `Token:SigningKey`. For Docker Compose,
set `TOKEN_SIGNING_KEY` in the deployment environment; for GitHub Actions,
store it as a production environment secret. A self-hosted key can be generated
with:

```bash
openssl rand -base64 32
```

Frontend API origin is configured with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5221
```

## Development Commands

```bash
# Backend tests
dotnet test backend/HookTray.sln

# Backend release publish
dotnet publish backend/HookTray.Api/HookTray.Api.csproj -c Release

# Frontend
cd frontend
npm run lint
npm test
npm run build
```

## Roadmap

The current roadmap is conservative:

- harden the local-first debugging loop
- improve self-hosting documentation
- add more privacy and security regression tests
- document deployment examples
- collect community feedback before expanding scope

Future proposals may explore replay, forwarding, custom responses, or hosted/community infrastructure, but those features require explicit design because they affect privacy, retention, and trust boundaries.

## Community and Support

HookTray is open-source and community-supported.

- Use GitHub Issues for reproducible bugs and focused feature proposals.
- Use pull requests for small, reviewable changes.
- Read [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.
- Follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) in project spaces.
- Report vulnerabilities privately using [SECURITY.md](SECURITY.md).

## License

HookTray is released under the [MIT License](LICENSE).
