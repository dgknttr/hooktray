namespace HookTray.Api.Options;

public class WebhookOptions
{
    public const string Section = "Webhook";

    public int MaxBodyBytes { get; init; } = 1_048_576;
    public int BodyPreviewLength { get; init; } = 200;
}
