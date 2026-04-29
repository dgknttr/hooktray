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

public class StreamEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public StreamEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(b =>
            b.ConfigureAppConfiguration((_, cfg) =>
                cfg.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Token:SigningKey"] = "test-token-signing-key-32-characters"
                })));
    }

    private async Task<string> CreateToken(HttpClient client)
    {
        var r = await client.PostAsync("/api/hooks", null, TestContext.Current.CancellationToken);
        var b = await r.Content.ReadFromJsonAsync<HookCreatedResponse>(TestContext.Current.CancellationToken);
        return b!.Token;
    }

    private static string CreateSignedTokenWithoutSession()
        => BuildTokenService().Generate();

    [Fact]
    public async Task GetStream_Returns404_ForUnknownToken()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/stream/unknown-token-xyz",
            HttpCompletionOption.ResponseHeadersRead, TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetStream_RestoresSession_ForSignedToken()
    {
        var client = _factory.CreateClient();
        var token = CreateSignedTokenWithoutSession();

        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
        using var response = await client.GetAsync(
            $"/api/stream/{token}",
            HttpCompletionOption.ResponseHeadersRead,
            cts.Token);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("text/event-stream", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task GetStream_RestoresSession_ForLegacyToken()
    {
        var client = _factory.CreateClient();
        var token = "QDohqnmKNMkcH_HggTqsxESVVXF2XUqSYL46ncVtPb0";

        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
        using var response = await client.GetAsync(
            $"/api/stream/{token}",
            HttpCompletionOption.ResponseHeadersRead,
            cts.Token);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("text/event-stream", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task GetStream_ReturnsEventStreamContentType()
    {
        var client = _factory.CreateClient();
        var token = await CreateToken(client);

        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
        try
        {
            var response = await client.GetAsync(
                $"/api/stream/{token}",
                HttpCompletionOption.ResponseHeadersRead,
                cts.Token);

            Assert.Equal("text/event-stream", response.Content.Headers.ContentType?.MediaType);
        }
        catch (OperationCanceledException) { /* SSE stream stays open — expected */ }
    }

    [Fact]
    public async Task GetStream_ReceivesEventAfterWebhookPost()
    {
        var client = _factory.CreateClient();
        var token = await CreateToken(client);

        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(8));
        var received = new TaskCompletionSource<string>();

        _ = Task.Run(async () =>
        {
            try
            {
                using var response = await client.GetAsync(
                    $"/api/stream/{token}",
                    HttpCompletionOption.ResponseHeadersRead,
                    cts.Token);
                using var stream = await response.Content.ReadAsStreamAsync(cts.Token);
                using var reader = new StreamReader(stream);
                var lastEventType = "";
                while (!cts.IsCancellationRequested)
                {
                    var line = await reader.ReadLineAsync(cts.Token);
                    if (line is null) continue;
                    if (line.StartsWith("event:"))
                        lastEventType = line["event:".Length..].Trim();
                    else if (line.StartsWith("data:") && lastEventType == "request")
                    {
                        received.TrySetResult(line);
                        return;
                    }
                }
            }
            catch (OperationCanceledException) { }
            catch (Exception ex) { received.TrySetException(ex); }
        }, cts.Token);

        // Wait for SSE to connect, then post webhook
        await Task.Delay(300, cts.Token);
        await client.PostAsync($"/hooks/{token}",
            new StringContent("{\"event\":\"payment.succeeded\"}", Encoding.UTF8, "application/json"),
            cts.Token);

        var data = await received.Task.WaitAsync(TimeSpan.FromSeconds(6), TestContext.Current.CancellationToken);
        Assert.Contains("payment.succeeded", data);
        Assert.DoesNotContain($"\"token\":\"{token}\"", data); // raw token must not appear in wire payload
    }

    [Fact]
    public async Task GetStream_RestoreThenReceivesEventAfterWebhookPost()
    {
        var client = _factory.CreateClient();
        var token = CreateSignedTokenWithoutSession();

        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(8));
        var received = new TaskCompletionSource<string>();

        _ = Task.Run(async () =>
        {
            try
            {
                using var response = await client.GetAsync(
                    $"/api/stream/{token}",
                    HttpCompletionOption.ResponseHeadersRead,
                    cts.Token);
                using var stream = await response.Content.ReadAsStreamAsync(cts.Token);
                using var reader = new StreamReader(stream);
                var lastEventType = "";
                while (!cts.IsCancellationRequested)
                {
                    var line = await reader.ReadLineAsync(cts.Token);
                    if (line is null) continue;
                    if (line.StartsWith("event:"))
                        lastEventType = line["event:".Length..].Trim();
                    else if (line.StartsWith("data:") && lastEventType == "request")
                    {
                        received.TrySetResult(line);
                        return;
                    }
                }
            }
            catch (OperationCanceledException) { }
            catch (Exception ex) { received.TrySetException(ex); }
        }, cts.Token);

        await Task.Delay(300, cts.Token);
        await client.PostAsync($"/hooks/{token}",
            new StringContent("{\"event\":\"restore.succeeded\"}", Encoding.UTF8, "application/json"),
            cts.Token);

        var data = await received.Task.WaitAsync(TimeSpan.FromSeconds(6), TestContext.Current.CancellationToken);
        Assert.Contains("restore.succeeded", data);
    }

    private static TokenService BuildTokenService()
        => new(
            Options.Create(new TokenOptions { SigningKey = "test-token-signing-key-32-characters" }),
            new TestHostEnvironment());

    private record HookCreatedResponse(string Token, string HookUrl, string StreamUrl);

    private sealed class TestHostEnvironment : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Development;
        public string ApplicationName { get; set; } = "HookTray.Tests";
        public string ContentRootPath { get; set; } = "";
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }
}
