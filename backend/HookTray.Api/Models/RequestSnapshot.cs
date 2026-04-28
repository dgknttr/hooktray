namespace HookTray.Api.Models;

public record RequestSnapshot(
    string Id,
    string Token,
    DateTimeOffset ReceivedAt,
    string Method,
    string Path,
    string RawQueryString,
    Dictionary<string, string> QueryParams,
    Dictionary<string, string> Headers,
    string? Body,
    string BodyEncoding,
    bool IsBase64Encoded,
    string? BodyPreview,
    long SizeBytes,
    string ClientIpHash
);
