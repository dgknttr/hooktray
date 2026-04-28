using HookTray.Api.Models;

public class RequestSnapshotTests
{
    [Fact]
    public void RequestSnapshot_StoresAllFields()
    {
        var snapshot = new RequestSnapshot(
            Id: "test-id",
            Token: "test-token",
            ReceivedAt: DateTimeOffset.UtcNow,
            Method: "POST",
            Path: "/hooks/test-token",
            RawQueryString: "foo=bar",
            QueryParams: new Dictionary<string, string> { ["foo"] = "bar" },
            Headers: new Dictionary<string, string> { ["content-type"] = "application/json" },
            Body: "{\"event\":\"test\"}",
            BodyEncoding: "utf-8",
            IsBase64Encoded: false,
            BodyPreview: "{\"event\":\"test\"}",
            SizeBytes: 16,
            ClientIpHash: "abc123"
        );

        Assert.Equal("POST", snapshot.Method);
        Assert.Equal("utf-8", snapshot.BodyEncoding);
        Assert.False(snapshot.IsBase64Encoded);
        Assert.Equal(16, snapshot.SizeBytes);
    }

    [Fact]
    public void RequestSnapshot_BodyPreview_IsFirst200Chars()
    {
        var longBody = new string('x', 300);
        var preview = longBody[..Math.Min(200, longBody.Length)];

        var snapshot = new RequestSnapshot(
            Id: "id", Token: "tok", ReceivedAt: DateTimeOffset.UtcNow,
            Method: "POST", Path: "/hooks/tok", RawQueryString: "",
            QueryParams: new(), Headers: new(),
            Body: longBody, BodyEncoding: "utf-8", IsBase64Encoded: false,
            BodyPreview: preview, SizeBytes: longBody.Length, ClientIpHash: "hash"
        );

        Assert.Equal(200, snapshot.BodyPreview!.Length);
    }
}
