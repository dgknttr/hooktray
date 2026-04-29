namespace HookTray.Api.Options;

public class TokenOptions
{
    public const string Section = "Token";

    public string? SigningKey { get; init; }
}
