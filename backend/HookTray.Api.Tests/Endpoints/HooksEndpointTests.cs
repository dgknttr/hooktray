using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

public class HooksEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public HooksEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task PostApiHooks_Returns201WithToken()
    {
        var response = await _client.PostAsync("/api/hooks", null, TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<HookCreatedResponse>(TestContext.Current.CancellationToken);
        Assert.NotNull(body);
        Assert.NotEmpty(body!.Token);
        Assert.Contains("/hooks/", body.HookUrl);
        Assert.Contains("/api/stream/", body.StreamUrl);
    }

    [Fact]
    public async Task PostApiHooks_ReturnsDifferentTokensEachCall()
    {
        var ct = TestContext.Current.CancellationToken;
        var r1 = await _client.PostAsync("/api/hooks", null, ct);
        var r2 = await _client.PostAsync("/api/hooks", null, ct);

        var b1 = await r1.Content.ReadFromJsonAsync<HookCreatedResponse>(ct);
        var b2 = await r2.Content.ReadFromJsonAsync<HookCreatedResponse>(ct);

        Assert.NotEqual(b1!.Token, b2!.Token);
    }

    private record HookCreatedResponse(string Token, string HookUrl, string StreamUrl);
}
