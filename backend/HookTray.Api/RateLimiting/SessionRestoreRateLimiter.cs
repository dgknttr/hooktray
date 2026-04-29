using System.Collections.Concurrent;
using HookTray.Api.Options;
using Microsoft.Extensions.Options;

namespace HookTray.Api.RateLimiting;

public class SessionRestoreRateLimiter
{
    private readonly int _maxPerMinute;
    private readonly ConcurrentDictionary<string, TokenBucket> _buckets = new();

    public SessionRestoreRateLimiter(IOptions<RateLimitOptions> options)
        => _maxPerMinute = options.Value.MaxSessionRestoresPerMinutePerIp;

    public bool IsAllowed(string ipHash)
        => _buckets.GetOrAdd(ipHash, _ => new TokenBucket(_maxPerMinute)).TryConsume();
}
