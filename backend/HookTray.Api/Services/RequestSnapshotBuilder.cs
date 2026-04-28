using System.Text;
using HookTray.Api.Models;
using HookTray.Api.Options;
using HookTray.Api.Sessions;
using Microsoft.Extensions.Options;

namespace HookTray.Api.Services;

public class RequestSnapshotBuilder
{
    private readonly WebhookOptions _options;

    public RequestSnapshotBuilder(IOptions<WebhookOptions> options)
        => _options = options.Value;

    public async Task<RequestSnapshot> BuildAsync(string token, HttpContext ctx)
    {
        var req = ctx.Request;
        var (body, bodyEncoding, isBase64) = await ReadBodyAsync(req);
        var headers = req.Headers.ToDictionary(h => h.Key.ToLowerInvariant(), h => h.Value.ToString());
        var queryParams = req.Query.ToDictionary(q => q.Key, q => q.Value.ToString());
        var ipHash = IpHasher.Hash(ctx.Connection.RemoteIpAddress?.ToString() ?? "");
        var sizeBytes = body is not null ? Encoding.UTF8.GetByteCount(body) : 0L;
        var bodyPreview = body is { Length: > 0 } && body.Length > _options.BodyPreviewLength
            ? body[.._options.BodyPreviewLength]
            : body;

        return new RequestSnapshot(
            Id: Guid.NewGuid().ToString(),
            Token: token,
            ReceivedAt: DateTimeOffset.UtcNow,
            Method: req.Method,
            Path: req.Path,
            RawQueryString: req.QueryString.Value ?? "",
            QueryParams: queryParams,
            Headers: headers,
            Body: body,
            BodyEncoding: bodyEncoding,
            IsBase64Encoded: isBase64,
            BodyPreview: bodyPreview,
            SizeBytes: sizeBytes,
            ClientIpHash: ipHash);
    }

    private async Task<(string? body, string encoding, bool isBase64)> ReadBodyAsync(HttpRequest req)
    {
        if (req.ContentLength is not > 0 && !req.Body.CanRead)
            return (null, "utf-8", false);

        using var ms = new MemoryStream();
        await req.Body.CopyToAsync(ms);
        var bytes = ms.ToArray();

        if (bytes.Length == 0)
            return (null, "utf-8", false);

        try
        {
            return (Encoding.UTF8.GetString(bytes), "utf-8", false);
        }
        catch
        {
            return (Convert.ToBase64String(bytes), "base64", true);
        }
    }

}
