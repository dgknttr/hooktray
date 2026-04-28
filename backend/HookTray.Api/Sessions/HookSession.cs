using System.Collections.Concurrent;
using System.Threading.Channels;
using HookTray.Api.Models;

namespace HookTray.Api.Sessions;

public class HookSession
{
    public string Token { get; }
    public DateTimeOffset CreatedAt { get; } = DateTimeOffset.UtcNow;
    public DateTimeOffset LastActivityAt { get; private set; } = DateTimeOffset.UtcNow;

    private readonly ConcurrentDictionary<string, Channel<RequestSnapshot>> _subscribers = new();

    public HookSession(string token) => Token = token;

    public bool HasActiveSubscribers => !_subscribers.IsEmpty;

    public void AddSubscriber(string subscriberId, Channel<RequestSnapshot> channel)
    {
        _subscribers[subscriberId] = channel;
        LastActivityAt = DateTimeOffset.UtcNow;
    }

    public void RemoveSubscriber(string subscriberId)
    {
        _subscribers.TryRemove(subscriberId, out _);
    }

    public void Broadcast(RequestSnapshot snapshot)
    {
        LastActivityAt = DateTimeOffset.UtcNow;
        foreach (var (_, channel) in _subscribers)
            channel.Writer.TryWrite(snapshot);
    }
}
