namespace HookTray.Api.Options;

public class RateLimitOptions
{
    public const string Section = "RateLimit";

    public int MaxWebhooksPerMinute { get; init; } = 60;
    public int MaxTokenCreationsPerMinutePerIp { get; init; } = 10;
}
