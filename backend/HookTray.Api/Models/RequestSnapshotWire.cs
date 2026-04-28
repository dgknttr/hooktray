namespace HookTray.Api.Models;

public record RequestSnapshotWire(
    string Id,
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
    long SizeBytes
);

public static class RequestSnapshotExtensions
{
    public static RequestSnapshotWire ToWire(this RequestSnapshot s) => new(
        s.Id, s.ReceivedAt, s.Method, s.Path, s.RawQueryString,
        s.QueryParams, s.Headers, s.Body, s.BodyEncoding,
        s.IsBase64Encoded, s.BodyPreview, s.SizeBytes);
}
