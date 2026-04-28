# Security Policy

HookTray handles untrusted webhook payloads and temporary secret URLs. Security reports are welcome and appreciated.

## Supported Versions

Until the first stable release, security fixes are handled on the default branch.

## Reporting a Vulnerability

Please do not open a public GitHub issue for vulnerabilities.

If the repository has GitHub private vulnerability reporting enabled, use that. Otherwise, contact the maintainer directly through the contact method listed on the repository profile.

Include:

- A clear description of the issue
- Reproduction steps or proof of concept
- Affected component: backend, frontend, deployment, or documentation
- Potential impact
- Any suggested fix, if available

Please avoid sending real webhook secrets, raw production payloads, access tokens, or personal data in the report.

## Security Expectations

- Enforce request body size limits.
- Treat webhook payloads as untrusted input.
- Escape rendered payload content.
- Mask sensitive headers in the UI by default.
- Use cryptographically secure random tokens.
- Never log raw tokens, raw IP addresses, request bodies, header values, or full payloads.
- Rate limit token creation and webhook receive endpoints.
- Clean up subscribers on disconnect.

## Out of Scope

The following reports are usually out of scope unless they demonstrate a concrete exploit:

- Missing security headers on local development servers
- Denial-of-service claims without a practical reproduction
- Issues that require physical access to a user's machine
- Reports involving modified local builds rather than the published project
