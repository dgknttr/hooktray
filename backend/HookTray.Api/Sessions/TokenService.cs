using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using HookTray.Api.Options;
using Microsoft.Extensions.Options;

namespace HookTray.Api.Sessions;

public class TokenService
{
    private const string Prefix = "ht1";
    private const int RandomByteCount = 32;
    private const string DevelopmentSigningKey = "hooktray-development-token-signing-key-do-not-use-in-production";
    private static readonly Regex LegacyTokenRegex = new("^[A-Za-z0-9_-]{43}$", RegexOptions.Compiled);
    private readonly byte[] _signingKey;

    public TokenService(IOptions<TokenOptions> options, IHostEnvironment environment)
    {
        var signingKey = options.Value.SigningKey;
        if (string.IsNullOrWhiteSpace(signingKey))
        {
            if (environment.IsProduction())
                throw new InvalidOperationException("Token:SigningKey is required in Production.");

            signingKey = DevelopmentSigningKey;
        }

        _signingKey = Encoding.UTF8.GetBytes(signingKey.Trim());
    }

    public string Generate()
    {
        var randomPart = Base64UrlEncode(RandomNumberGenerator.GetBytes(RandomByteCount));
        var payload = $"{Prefix}.{randomPart}";
        return $"{payload}.{Sign(payload)}";
    }

    public bool IsRestorableToken(string token)
        => IsSignedTokenValid(token) || IsLegacyTokenFormatValid(token);

    public bool IsLegacyTokenFormatValid(string token)
        => LegacyTokenRegex.IsMatch(token);

    public bool IsSignedTokenValid(string token)
    {
        var parts = token.Split('.');
        if (parts.Length != 3 || parts[0] != Prefix)
            return false;

        var randomPart = parts[1];
        var signature = parts[2];
        if (!LegacyTokenRegex.IsMatch(randomPart) || !LegacyTokenRegex.IsMatch(signature))
            return false;

        byte[] actualSignature;
        try
        {
            actualSignature = Base64UrlDecode(signature);
        }
        catch (FormatException)
        {
            return false;
        }

        var expectedSignature = SignBytes($"{Prefix}.{randomPart}");
        return CryptographicOperations.FixedTimeEquals(actualSignature, expectedSignature);
    }

    public string HashToken(string token)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(hash)[..8].ToLowerInvariant();
    }

    private string Sign(string payload)
        => Base64UrlEncode(SignBytes(payload));

    private byte[] SignBytes(string payload)
    {
        using var hmac = new HMACSHA256(_signingKey);
        return hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
    }

    private static string Base64UrlEncode(byte[] bytes)
        => Convert.ToBase64String(bytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .TrimEnd('=');

    private static byte[] Base64UrlDecode(string value)
    {
        var padded = value.Replace("-", "+").Replace("_", "/");
        padded = padded.PadRight(padded.Length + ((4 - padded.Length % 4) % 4), '=');
        return Convert.FromBase64String(padded);
    }
}
