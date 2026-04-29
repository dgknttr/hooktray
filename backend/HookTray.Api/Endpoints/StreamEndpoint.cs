using System.Text;
using System.Text.Json;
using System.Threading.Channels;
using HookTray.Api.Models;
using HookTray.Api.RateLimiting;
using HookTray.Api.Sessions;

namespace HookTray.Api.Endpoints;

public static class StreamEndpoint
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static void Map(WebApplication app)
    {
        app.MapGet("/api/stream/{token}", async (
            string token,
            HttpContext ctx,
            SessionStore store,
            TokenService tokenService,
            SessionRestoreRateLimiter restoreRateLimiter,
            CancellationToken ct) =>
        {
            if (!store.TryGet(token, out var session))
            {
                if (!tokenService.IsRestorableToken(token))
                    return Results.NotFound(new { error = "unknown_token" });

                var ipHash = IpHasher.Hash(ctx.Connection.RemoteIpAddress?.ToString() ?? "");
                if (!restoreRateLimiter.IsAllowed(ipHash))
                    return Results.Json(
                        new { error = "rate_limit_exceeded" },
                        statusCode: StatusCodes.Status429TooManyRequests);

                session = store.GetOrCreate(token);
            }

            ctx.Response.Headers.Append("Content-Type", "text/event-stream");
            ctx.Response.Headers.Append("Cache-Control", "no-cache");
            ctx.Response.Headers.Append("X-Accel-Buffering", "no");
            ctx.Response.Headers.Append("Connection", "keep-alive");

            var subscriberId = Guid.NewGuid().ToString();
            var channel = Channel.CreateUnbounded<RequestSnapshot>();
            session!.AddSubscriber(subscriberId, channel);

            try
            {
                await WriteEvent(ctx.Response, "connected", JsonSerializer.Serialize(new { token }, JsonOptions), ct);

                await foreach (var snapshot in channel.Reader.ReadAllAsync(ct))
                {
                    var json = JsonSerializer.Serialize(snapshot.ToWire(), JsonOptions);
                    await WriteEvent(ctx.Response, "request", json, ct);
                }
            }
            catch (OperationCanceledException) { }
            finally
            {
                session.RemoveSubscriber(subscriberId);
                channel.Writer.TryComplete();
            }

            return Results.Empty;
        });
    }

    private static async Task WriteEvent(HttpResponse response, string eventName, string data, CancellationToken ct)
    {
        var bytes = Encoding.UTF8.GetBytes($"event: {eventName}\ndata: {data}\n\n");
        await response.Body.WriteAsync(bytes, ct);
        await response.Body.FlushAsync(ct);
    }
}
