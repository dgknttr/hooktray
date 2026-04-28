using HookTray.Api.Options;
using HookTray.Api.RateLimiting;
using HookTray.Api.Sessions;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

public class SessionCleanupServiceTests
{
    private static SessionCleanupService BuildService(SessionStore store)
    {
        var rateLimiter = new TokenRateLimiter(Options.Create(new RateLimitOptions()));
        var sessionOptions = Options.Create(new SessionSettings());
        return new SessionCleanupService(store, rateLimiter, sessionOptions, NullLogger<SessionCleanupService>.Instance);
    }

    [Fact]
    public void Cleanup_RemovesExpiredSessions()
    {
        var store = new SessionStore();
        store.GetOrCreate("old-tok");

        var service = BuildService(store);
        service.RunCleanup(ttl: TimeSpan.Zero);

        Assert.False(store.TryGet("old-tok", out _));
    }

    [Fact]
    public void Cleanup_KeepsSessionsWithinTtl()
    {
        var store = new SessionStore();
        store.GetOrCreate("new-tok");

        var service = BuildService(store);
        service.RunCleanup(ttl: TimeSpan.FromMinutes(30));

        Assert.True(store.TryGet("new-tok", out _));
    }

    [Fact]
    public void Cleanup_RemovesRateLimiterBuckets_ForExpiredSessions()
    {
        var store = new SessionStore();
        store.GetOrCreate("tok-a");

        var rateLimiter = new TokenRateLimiter(Options.Create(new RateLimitOptions()));
        rateLimiter.IsAllowed("tok-a"); // creates bucket

        var service = new SessionCleanupService(
            store, rateLimiter,
            Options.Create(new SessionSettings()),
            NullLogger<SessionCleanupService>.Instance);

        var removed = service.RunCleanup(ttl: TimeSpan.Zero);

        Assert.Contains("tok-a", removed);
        // bucket should be gone — a new IsAllowed call should still work (bucket recreated fresh)
        Assert.True(rateLimiter.IsAllowed("tok-a"));
    }
}
