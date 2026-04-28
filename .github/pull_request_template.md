## Summary

Describe the change and why it is needed.

## Type of Change

- [ ] Bug fix
- [ ] Feature
- [ ] Documentation
- [ ] Refactor
- [ ] Test

## Privacy and Security

- [ ] This change does not log request bodies, header values, raw tokens, raw IP addresses, full payloads, or sensitive credentials.
- [ ] This change preserves the default "no server-side request history" promise.
- [ ] User-rendered payload content is escaped and treated as untrusted input.
- [ ] New limits, retention behavior, persistence, forwarding, replay, accounts, or billing were explicitly approved.

## Testing

- [ ] `dotnet test backend/HookTray.sln`
- [ ] `dotnet publish backend/HookTray.Api/HookTray.Api.csproj -c Release`
- [ ] `npm run lint` in `frontend/`
- [ ] `npm test` in `frontend/`
- [ ] `npm run build` in `frontend/`

## Notes

Add screenshots, API examples, or follow-up notes here.
