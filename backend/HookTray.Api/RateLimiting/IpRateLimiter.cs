using System.Collections.Concurrent;
using HookTray.Api.Options;
using Microsoft.Extensions.Options;

namespace HookTray.Api.RateLimiting;

public class IpRateLimiter
{
    private readonly int _maxPerMinute;
    private readonly ConcurrentDictionary<string, TokenBucket> _buckets = new();

    public IpRateLimiter(IOptions<RateLimitOptions> options)
        => _maxPerMinute = options.Value.MaxTokenCreationsPerMinutePerIp;

    public bool IsAllowed(string ipHash)
        => _buckets.GetOrAdd(ipHash, _ => new TokenBucket(_maxPerMinute)).TryConsume();
}
