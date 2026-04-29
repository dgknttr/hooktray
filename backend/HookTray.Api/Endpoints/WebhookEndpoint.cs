using HookTray.Api.Options;
using HookTray.Api.RateLimiting;
using HookTray.Api.Services;
using HookTray.Api.Sessions;
using Microsoft.Extensions.Options;

namespace HookTray.Api.Endpoints;

public static class WebhookEndpoint
{
    public static void Map(WebApplication app)
    {
        var methods = new[] { "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS" };

        app.MapMethods("/hooks/{token}", methods, async (
            string token,
            HttpContext ctx,
            SessionStore store,
            TokenRateLimiter rateLimiter,
            TokenService tokenService,
            RequestSnapshotBuilder snapshotBuilder,
            IOptions<WebhookOptions> webhookOptions,
            ILogger<Program> logger) =>
        {
            if (!store.TryGet(token, out var session))
                return Results.NotFound(new { error = "unknown_token" });

            if (!rateLimiter.IsAllowed(token))
                return Results.Json(
                    new { error = "rate_limit_exceeded" },
                    statusCode: StatusCodes.Status429TooManyRequests);

            if (ctx.Request.ContentLength > webhookOptions.Value.MaxBodyBytes)
                return Results.StatusCode(StatusCodes.Status413RequestEntityTooLarge);

            var snapshot = await snapshotBuilder.BuildAsync(token, ctx);

            var delivered = session.HasActiveSubscribers;
            if (delivered)
                session.Broadcast(snapshot);

            logger.LogInformation(
                "Webhook received token_hash={TokenHash} method={Method} path={Path} size={Size} delivered={Delivered}",
                tokenService.HashToken(token),
                snapshot.Method,
                snapshot.Path,
                snapshot.SizeBytes,
                delivered);

            return Results.Ok(delivered
                ? (object)new { ok = true, delivered = true }
                : new { ok = true, delivered = false, reason = "no_active_browser_session" });
        });
    }
}
