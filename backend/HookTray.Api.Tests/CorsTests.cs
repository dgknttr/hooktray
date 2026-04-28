using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

public class CorsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public CorsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(b =>
            b.ConfigureAppConfiguration((_, cfg) =>
                cfg.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Cors:AllowedOrigins:0"] = "http://localhost:3000"
                })));
    }

    [Fact]
    public async Task HealthEndpoint_ReturnsCorsHeader_ForAllowedOrigin()
    {
        var client = _factory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/health");
        request.Headers.Add("Origin", "http://localhost:3000");

        var response = await client.SendAsync(request, TestContext.Current.CancellationToken);

        Assert.True(
            response.Headers.Contains("Access-Control-Allow-Origin"),
            "Expected Access-Control-Allow-Origin header");
        Assert.Equal("http://localhost:3000",
            response.Headers.GetValues("Access-Control-Allow-Origin").First());
    }

    [Fact]
    public async Task HealthEndpoint_NoCorsHeader_ForUnknownOrigin()
    {
        var client = _factory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/health");
        request.Headers.Add("Origin", "https://evil.example.com");

        var response = await client.SendAsync(request, TestContext.Current.CancellationToken);

        Assert.False(
            response.Headers.Contains("Access-Control-Allow-Origin"),
            "Should not return CORS header for unknown origin");
    }
}
