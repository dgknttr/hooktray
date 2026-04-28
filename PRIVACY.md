# Privacy

HookTray is built around a simple promise: webhook debugging should stay in your browser by default.

## Default Behavior

- HookTray does not persist webhook request payloads server-side by default.
- Incoming webhook requests are streamed to active browser subscribers over Server-Sent Events.
- Browser request history is stored locally in IndexedDB.
- If no browser session is active, the backend discards the request after returning a delivery response.
- Hook URLs are temporary secrets and should be treated like credentials.

## Local Browser Storage

The frontend stores request history in IndexedDB so a refresh does not erase the debugging session. This history is local to the browser and can be cleared from the app.

## Server Logging

Server logs must be privacy-preserving. Logs may include operational metadata needed for security and abuse prevention, such as:

- Hashed token
- Hashed IP address
- HTTP method
- Request path
- Payload size in bytes
- Delivery status
- Timestamp

Server logs must not include:

- Request bodies
- Header values
- Raw tokens
- Raw IP addresses
- Full webhook payloads
- Sensitive credentials

## Infrastructure Logs

If you self-host HookTray behind a reverse proxy or hosting platform, that infrastructure may create access logs. Configure those logs to avoid storing sensitive payloads, raw tokens, or unnecessary personal data.

## Data Retention

The default application design has no server-side request history. Any future change that introduces persistence, replay, forwarding, long-term retention, accounts, billing, or team features must be explicitly approved and documented before implementation.
