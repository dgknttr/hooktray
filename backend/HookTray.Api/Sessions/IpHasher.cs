using System.Security.Cryptography;
using System.Text;

namespace HookTray.Api.Sessions;

public static class IpHasher
{
    public static string Hash(string ip)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(ip));
        return Convert.ToHexString(hash)[..16].ToLowerInvariant();
    }
}
