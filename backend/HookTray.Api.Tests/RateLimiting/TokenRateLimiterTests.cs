using HookTray.Api.Options;
using HookTray.Api.RateLimiting;
using Microsoft.Extensions.Options;

public class TokenRateLimiterTests
{
    private static TokenRateLimiter Build(int max) =>
        new(Options.Create(new RateLimitOptions { MaxWebhooksPerMinute = max }));

    [Fact]
    public void IsAllowed_TrueForFirstRequest()
    {
        var limiter = Build(60);
        Assert.True(limiter.IsAllowed("tok1"));
    }

    [Fact]
    public void IsAllowed_FalseAfterExceedingLimit()
    {
        var limiter = Build(3);
        Assert.True(limiter.IsAllowed("tok1"));
        Assert.True(limiter.IsAllowed("tok1"));
        Assert.True(limiter.IsAllowed("tok1"));
        Assert.False(limiter.IsAllowed("tok1"));
    }

    [Fact]
    public void IsAllowed_DifferentTokensAreIndependent()
    {
        var limiter = Build(1);
        Assert.True(limiter.IsAllowed("tok1"));
        Assert.False(limiter.IsAllowed("tok1"));
        Assert.True(limiter.IsAllowed("tok2"));
    }

    [Fact]
    public void RemoveBuckets_AllowsFullQuotaAgainAfterRemoval()
    {
        var limiter = Build(1);
        Assert.True(limiter.IsAllowed("tok1"));
        Assert.False(limiter.IsAllowed("tok1")); // exhausted

        limiter.RemoveBuckets(["tok1"]);

        Assert.True(limiter.IsAllowed("tok1")); // fresh bucket
    }
}
