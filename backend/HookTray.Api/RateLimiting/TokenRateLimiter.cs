using System.Collections.Concurrent;
using HookTray.Api.Options;
using Microsoft.Extensions.Options;

namespace HookTray.Api.RateLimiting;

public class TokenRateLimiter
{
    private readonly int _maxPerMinute;
    private readonly ConcurrentDictionary<string, TokenBucket> _buckets = new();

    public TokenRateLimiter(IOptions<RateLimitOptions> options)
        => _maxPerMinute = options.Value.MaxWebhooksPerMinute;

    public bool IsAllowed(string token)
        => _buckets.GetOrAdd(token, _ => new TokenBucket(_maxPerMinute)).TryConsume();

    public void RemoveBuckets(IEnumerable<string> tokens)
    {
        foreach (var token in tokens)
            _buckets.TryRemove(token, out _);
    }
}
