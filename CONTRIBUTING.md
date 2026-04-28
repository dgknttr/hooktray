# Contributing to HookTray

Thanks for considering a contribution. HookTray is intentionally small, local-first, and privacy-preserving, so the best contributions keep the product simple and the trust model clear.

## Before You Start

- Read [README.md](README.md), [PRIVACY.md](PRIVACY.md), and [SECURITY.md](SECURITY.md).
- Check existing issues and pull requests.
- Keep changes focused. Avoid bundling unrelated refactors with features or fixes.

## Scope Rules

Do not add these capabilities unless they are explicitly approved in the current spec or issue:

- User accounts
- Billing
- Server-side request history
- Request replay
- Request forwarding
- Custom domains
- Team workspaces
- Redis or PostgreSQL persistence
- Long-term retention
- Multi-instance or distributed architecture

These ideas are not rejected forever; they are scope-controlled because they change the product promise.

## Development Setup

```bash
# Backend
cd backend
dotnet restore HookTray.sln
dotnet test HookTray.sln

# Frontend
cd frontend
npm ci
npm test
```

## Pull Request Checklist

- The change matches the approved issue, spec, or discussion.
- Business logic is kept out of `Program.cs` and large endpoint handlers.
- Security and privacy behavior is preserved.
- New limits or timeouts use options/configuration instead of scattered magic numbers.
- Tests are added or updated when practical.
- These commands pass:

```bash
dotnet test backend/HookTray.sln
dotnet publish backend/HookTray.Api/HookTray.Api.csproj -c Release

cd frontend
npm run lint
npm test
npm run build
```

## Coding Style

- Prefer small, focused classes and thin Minimal API endpoints.
- Use concrete classes with dependency injection unless an interface has a real reason to exist.
- Keep request snapshot building, token handling, IP hashing, session storage, SSE streaming, rate limiting, and safe logging separate.
- Never use `dangerouslySetInnerHTML` for webhook payloads.
- Treat every webhook payload as untrusted input.

## Privacy-Safe Logging

Never log:

- Request bodies
- Header values
- Raw tokens
- Raw IP addresses
- Full webhook payloads
- Sensitive credentials

Allowed structured fields include:

- `token_hash`
- `ip_hash`
- `method`
- `path`
- `size_bytes`
- `delivered`
- `status`
- `timestamp`

## Reporting Security Issues

Please do not open public issues for vulnerabilities. Follow [SECURITY.md](SECURITY.md).
