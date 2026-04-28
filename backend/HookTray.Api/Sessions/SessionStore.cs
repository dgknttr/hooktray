using System.Collections.Concurrent;

namespace HookTray.Api.Sessions;

public class SessionStore
{
    private readonly ConcurrentDictionary<string, HookSession> _sessions = new();

    public HookSession GetOrCreate(string token)
        => _sessions.GetOrAdd(token, t => new HookSession(t));

    public bool TryGet(string token, [System.Diagnostics.CodeAnalysis.NotNullWhen(true)] out HookSession? session)
        => _sessions.TryGetValue(token, out session);

    public IReadOnlyList<string> RemoveExpired(TimeSpan ttl)
    {
        var cutoff = DateTimeOffset.UtcNow - ttl;
        var removed = new List<string>();
        foreach (var (token, session) in _sessions)
        {
            if (!session.HasActiveSubscribers && session.LastActivityAt <= cutoff)
            {
                if (_sessions.TryRemove(token, out _))
                    removed.Add(token);
            }
        }
        return removed;
    }
}
