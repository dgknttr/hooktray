using System.Threading.Channels;
using HookTray.Api.Models;
using HookTray.Api.Sessions;

public class SessionStoreTests
{
    [Fact]
    public void GetOrCreate_ReturnsSameSessionForSameToken()
    {
        var store = new SessionStore();
        var s1 = store.GetOrCreate("tok");
        var s2 = store.GetOrCreate("tok");
        Assert.Same(s1, s2);
    }

    [Fact]
    public void GetOrCreate_ReturnsDifferentSessionForDifferentToken()
    {
        var store = new SessionStore();
        var s1 = store.GetOrCreate("tok1");
        var s2 = store.GetOrCreate("tok2");
        Assert.NotSame(s1, s2);
    }

    [Fact]
    public void TryGet_ReturnsFalseForUnknownToken()
    {
        var store = new SessionStore();
        var found = store.TryGet("unknown", out var session);
        Assert.False(found);
        Assert.Null(session);
    }

    [Fact]
    public void TryGet_ReturnsTrueAfterGetOrCreate()
    {
        var store = new SessionStore();
        store.GetOrCreate("tok");
        var found = store.TryGet("tok", out var session);
        Assert.True(found);
        Assert.NotNull(session);
    }

    [Fact]
    public void RemoveExpired_RemovesSessionsWithNoSubscribersOlderThanTtl()
    {
        var store = new SessionStore();
        store.GetOrCreate("tok");

        store.RemoveExpired(ttl: TimeSpan.Zero);

        var found = store.TryGet("tok", out _);
        Assert.False(found);
    }

    [Fact]
    public void RemoveExpired_KeepsSessionsWithActiveSubscribers()
    {
        var store = new SessionStore();
        var session = store.GetOrCreate("tok");
        var ch = Channel.CreateUnbounded<RequestSnapshot>();
        session.AddSubscriber("sub1", ch);

        store.RemoveExpired(ttl: TimeSpan.Zero);

        var found = store.TryGet("tok", out _);
        Assert.True(found);
    }
}
