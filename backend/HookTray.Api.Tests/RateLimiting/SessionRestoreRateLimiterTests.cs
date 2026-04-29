using HookTray.Api.Options;
using HookTray.Api.RateLimiting;
using Microsoft.Extensions.Options;

public class SessionRestoreRateLimiterTests
{
    private static SessionRestoreRateLimiter Build(int max) =>
        new(Options.Create(new RateLimitOptions { MaxSessionRestoresPerMinutePerIp = max }));

    [Fact]
    public void IsAllowed_TrueForFirstRestore()
    {
        var limiter = Build(10);
        Assert.True(limiter.IsAllowed("aabbccdd11223344"));
    }

    [Fact]
    public void IsAllowed_FalseAfterExceedingLimit()
    {
        var limiter = Build(2);
        Assert.True(limiter.IsAllowed("ip1"));
        Assert.True(limiter.IsAllowed("ip1"));
        Assert.False(limiter.IsAllowed("ip1"));
    }

    [Fact]
    public void IsAllowed_DifferentIpsAreIndependent()
    {
        var limiter = Build(1);
        Assert.True(limiter.IsAllowed("ip1"));
        Assert.False(limiter.IsAllowed("ip1"));
        Assert.True(limiter.IsAllowed("ip2"));
    }
}
