namespace HookTray.Api.RateLimiting;

internal class TokenBucket
{
    private readonly int _max;
    private int _tokens;
    private DateTimeOffset _lastRefill = DateTimeOffset.UtcNow;
    private readonly object _lock = new();

    public TokenBucket(int max) { _max = max; _tokens = max; }

    public bool TryConsume()
    {
        lock (_lock)
        {
            Refill();
            if (_tokens <= 0) return false;
            _tokens--;
            return true;
        }
    }

    private void Refill()
    {
        var now = DateTimeOffset.UtcNow;
        if (now - _lastRefill >= TimeSpan.FromMinutes(1))
        {
            _tokens = _max;
            _lastRefill = now;
        }
    }
}
