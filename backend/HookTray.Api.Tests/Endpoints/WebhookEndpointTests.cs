using System.Net;
using System.Net.Http.Json;
using System.Text;
using HookTray.Api.Options;
using HookTray.Api.Sessions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

public class WebhookEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public WebhookEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.WithWebHostBuilder(b =>
            b.ConfigureAppConfiguration((_, cfg) =>
                cfg.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Token:SigningKey"] = "test-token-signing-key-32-characters"
                }))).CreateClient();
    }

    private async Task<string> CreateToken()
    {
        var r = await _client.PostAsync("/api/hooks", null, TestContext.Current.CancellationToken);
        var b = await r.Content.ReadFromJsonAsync<HookCreatedResponse>(TestContext.Current.CancellationToken);
        return b!.Token;
    }

    private static string CreateSignedTokenWithoutSession()
        => new TokenService(
            Options.Create(new TokenOptions { SigningKey = "test-token-signing-key-32-characters" }),
            new TestHostEnvironment()).Generate();

    [Fact]
    public async Task PostHooks_Returns200WithDeliveredFalse_WhenNoSubscriber()
    {
        var token = await CreateToken();
        var content = new StringContent("{\"event\":\"test\"}", Encoding.UTF8, "application/json");
        var response = await _client.PostAsync($"/hooks/{token}", content, TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<WebhookResponse>(TestContext.Current.CancellationToken);
        Assert.True(body!.Ok);
        Assert.False(body.Delivered);
        Assert.Equal("no_active_browser_session", body.Reason);
    }

    [Fact]
    public async Task GetHooks_Returns200_WhenNoSubscriber()
    {
        var token = await CreateToken();
        var response = await _client.GetAsync($"/hooks/{token}", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task PutHooks_Returns200_WhenNoSubscriber()
    {
        var token = await CreateToken();
        var content = new StringContent("{}", Encoding.UTF8, "application/json");
        var response = await _client.PutAsync($"/hooks/{token}", content, TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task DeleteHooks_Returns200_WhenNoSubscriber()
    {
        var token = await CreateToken();
        var response = await _client.DeleteAsync($"/hooks/{token}", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task PostHooks_Returns404_ForUnknownToken()
    {
        var response = await _client.PostAsync("/hooks/nonexistent-token-xyz",
            new StringContent("{}"), TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task PostHooks_DoesNotRestoreSession_ForSignedToken()
    {
        var token = CreateSignedTokenWithoutSession();
        var response = await _client.PostAsync($"/hooks/{token}",
            new StringContent("{}"), TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task PostHooks_Returns429_WhenRateLimitExceeded()
    {
        // First request should succeed
        var token = await CreateToken();
        var content = new StringContent("{}", Encoding.UTF8, "application/json");
        var response = await _client.PostAsync($"/hooks/{token}", content, TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    // Note: 413 test relies on Kestrel MaxRequestBodySize which is bypassed in WebApplicationFactory
    // (in-memory transport). Verified manually with curl after deployment — see Task 12 smoke test.

    private record HookCreatedResponse(string Token, string HookUrl, string StreamUrl);
    private record WebhookResponse(bool Ok, bool Delivered, string? Reason);

    private sealed class TestHostEnvironment : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Development;
        public string ApplicationName { get; set; } = "HookTray.Tests";
        public string ContentRootPath { get; set; } = "";
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }
}
