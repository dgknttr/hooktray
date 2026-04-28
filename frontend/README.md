# HookTray Frontend

This is the static Next.js frontend for HookTray.

The root [README](../README.md) contains the full project overview, architecture, and development flow. This file is intentionally short so package-specific commands remain easy to find.

## Development

```bash
npm ci
NEXT_PUBLIC_API_URL=http://localhost:5221 npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run lint
npm test
npm run build
```

## Configuration

`NEXT_PUBLIC_API_URL` should point at the HookTray API origin.

For same-origin deployments behind a reverse proxy, it can be omitted and the frontend will call relative API paths.
