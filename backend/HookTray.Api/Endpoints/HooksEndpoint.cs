using HookTray.Api.RateLimiting;
using HookTray.Api.Sessions;

namespace HookTray.Api.Endpoints;

public static class HooksEndpoint
{
    public static void Map(WebApplication app)
    {
        app.MapPost("/api/hooks", (
            HttpContext ctx,
            SessionStore store,
            IpRateLimiter ipRateLimiter,
            TokenService tokenService) =>
        {
            var ipHash = IpHasher.Hash(ctx.Connection.RemoteIpAddress?.ToString() ?? "");
            if (!ipRateLimiter.IsAllowed(ipHash))
                return Results.Json(
                    new { error = "rate_limit_exceeded" },
                    statusCode: StatusCodes.Status429TooManyRequests);

            var token = tokenService.Generate();
            store.GetOrCreate(token);

            var baseUrl = $"{ctx.Request.Scheme}://{ctx.Request.Host}";
            return Results.Created($"/api/hooks/{token}", new
            {
                token,
                hookUrl = $"{baseUrl}/hooks/{token}",
                streamUrl = $"{baseUrl}/api/stream/{token}"
            });
        });
    }
}
