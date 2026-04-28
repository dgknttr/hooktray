using HookTray.Api.Sessions;

public class TokenGeneratorTests
{
    [Fact]
    public void Generate_Returns43CharUrlSafeString()
    {
        var token = TokenGenerator.Generate();

        Assert.Equal(43, token.Length);
        Assert.DoesNotContain("+", token);
        Assert.DoesNotContain("/", token);
        Assert.DoesNotContain("=", token);
    }

    [Fact]
    public void Generate_ReturnsDifferentTokensEachCall()
    {
        var tokens = Enumerable.Range(0, 100).Select(_ => TokenGenerator.Generate()).ToList();
        var distinct = tokens.Distinct().Count();
        Assert.Equal(100, distinct);
    }

    [Fact]
    public void HashToken_ReturnsSameHashForSameToken()
    {
        var token = TokenGenerator.Generate();
        var hash1 = TokenGenerator.HashToken(token);
        var hash2 = TokenGenerator.HashToken(token);
        Assert.Equal(hash1, hash2);
    }

    [Fact]
    public void HashToken_Returns8CharPrefix()
    {
        var token = TokenGenerator.Generate();
        var hash = TokenGenerator.HashToken(token);
        Assert.Equal(8, hash.Length);
    }
}
