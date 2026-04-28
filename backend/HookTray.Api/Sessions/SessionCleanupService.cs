using HookTray.Api.Options;
using HookTray.Api.RateLimiting;
using Microsoft.Extensions.Options;

namespace HookTray.Api.Sessions;

public class SessionCleanupService : BackgroundService
{
    private readonly SessionStore _store;
    private readonly TokenRateLimiter _rateLimiter;
    private readonly SessionSettings _options;
    private readonly ILogger<SessionCleanupService> _logger;

    public SessionCleanupService(
        SessionStore store,
        TokenRateLimiter rateLimiter,
        IOptions<SessionSettings> options,
        ILogger<SessionCleanupService> logger)
    {
        _store = store;
        _rateLimiter = rateLimiter;
        _options = options.Value;
        _logger = logger;
    }

    public IReadOnlyList<string> RunCleanup(TimeSpan ttl)
    {
        var removed = _store.RemoveExpired(ttl);
        if (removed.Count > 0)
            _rateLimiter.RemoveBuckets(removed);
        return removed;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(_options.CleanupInterval, stoppingToken);
            var removed = RunCleanup(_options.Ttl);
            _logger.LogInformation(
                "Session cleanup ran at {Time}, removed={Count}",
                DateTimeOffset.UtcNow, removed.Count);
        }
    }
}
