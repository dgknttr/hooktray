using HookTray.Api.Sessions;
using HookTray.Api.Options;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

public class TokenServiceTests
{
    [Fact]
    public void Generate_ReturnsSignedUrlSafeToken()
    {
        var token = Build().Generate();

        Assert.StartsWith("ht1.", token);
        Assert.DoesNotContain("+", token);
        Assert.DoesNotContain("/", token);
        Assert.DoesNotContain("=", token);
        Assert.True(Build().IsSignedTokenValid(token));
    }

    [Fact]
    public void Generate_ReturnsDifferentTokensEachCall()
    {
        var service = Build();
        var tokens = Enumerable.Range(0, 100).Select(_ => service.Generate()).ToList();
        var distinct = tokens.Distinct().Count();
        Assert.Equal(100, distinct);
    }

    [Fact]
    public void IsSignedTokenValid_ReturnsFalseForTamperedToken()
    {
        var service = Build();
        var token = service.Generate();
        var tampered = token[..^1] + (token[^1] == 'A' ? 'B' : 'A');

        Assert.False(service.IsSignedTokenValid(tampered));
    }

    [Fact]
    public void IsRestorableToken_ReturnsFalseForMalformedToken()
    {
        var service = Build();
        Assert.False(service.IsRestorableToken("plain-text"));
    }

    [Fact]
    public void LegacyToken_IsRestorableButNotSignedValid()
    {
        var service = Build();
        var legacy = "QDohqnmKNMkcH_HggTqsxESVVXF2XUqSYL46ncVtPb0";

        Assert.True(service.IsRestorableToken(legacy));
        Assert.True(service.IsLegacyTokenFormatValid(legacy));
        Assert.False(service.IsSignedTokenValid(legacy));
    }

    [Fact]
    public void Constructor_ThrowsInProductionWithoutSigningKey()
    {
        var env = new TestHostEnvironment { EnvironmentName = Environments.Production };
        var options = Options.Create(new TokenOptions());

        Assert.Throws<InvalidOperationException>(() => new TokenService(options, env));
    }

    [Fact]
    public void HashToken_ReturnsSameHashForSameToken()
    {
        var service = Build();
        var token = service.Generate();
        var hash1 = service.HashToken(token);
        var hash2 = service.HashToken(token);
        Assert.Equal(hash1, hash2);
    }

    [Fact]
    public void HashToken_Returns8CharPrefix()
    {
        var service = Build();
        var token = service.Generate();
        var hash = service.HashToken(token);
        Assert.Equal(8, hash.Length);
    }

    private static TokenService Build(string signingKey = "test-token-signing-key-32-characters")
        => new(
            Options.Create(new TokenOptions { SigningKey = signingKey }),
            new TestHostEnvironment());

    private sealed class TestHostEnvironment : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Development;
        public string ApplicationName { get; set; } = "HookTray.Tests";
        public string ContentRootPath { get; set; } = "";
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }
}
