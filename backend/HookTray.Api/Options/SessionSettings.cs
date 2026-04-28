namespace HookTray.Api.Options;

public class SessionSettings
{
    public const string Section = "Session";

    public TimeSpan Ttl { get; init; } = TimeSpan.FromMinutes(30);
    public TimeSpan CleanupInterval { get; init; } = TimeSpan.FromMinutes(5);
}
