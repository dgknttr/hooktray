using System.Threading.Channels;
using HookTray.Api.Models;
using HookTray.Api.Sessions;

public class HookSessionTests
{
    private static RequestSnapshot MakeSnapshot() => new(
        Id: Guid.NewGuid().ToString(),
        Token: "tok",
        ReceivedAt: DateTimeOffset.UtcNow,
        Method: "POST", Path: "/hooks/tok", RawQueryString: "",
        QueryParams: new(), Headers: new(),
        Body: "{}", BodyEncoding: "utf-8", IsBase64Encoded: false,
        BodyPreview: "{}", SizeBytes: 2, ClientIpHash: "abc"
    );

    [Fact]
    public void HasActiveSubscribers_FalseWhenEmpty()
    {
        var session = new HookSession("tok");
        Assert.False(session.HasActiveSubscribers);
    }

    [Fact]
    public void HasActiveSubscribers_TrueAfterAdd()
    {
        var session = new HookSession("tok");
        var ch = Channel.CreateUnbounded<RequestSnapshot>();
        session.AddSubscriber("sub1", ch);
        Assert.True(session.HasActiveSubscribers);
    }

    [Fact]
    public void RemoveSubscriber_ClearsSubscriber()
    {
        var session = new HookSession("tok");
        var ch = Channel.CreateUnbounded<RequestSnapshot>();
        session.AddSubscriber("sub1", ch);
        session.RemoveSubscriber("sub1");
        Assert.False(session.HasActiveSubscribers);
    }

    [Fact]
    public async Task Broadcast_WritesToAllSubscribers()
    {
        var session = new HookSession("tok");
        var ch1 = Channel.CreateUnbounded<RequestSnapshot>();
        var ch2 = Channel.CreateUnbounded<RequestSnapshot>();
        session.AddSubscriber("sub1", ch1);
        session.AddSubscriber("sub2", ch2);

        var snapshot = MakeSnapshot();
        session.Broadcast(snapshot);

        var ct = TestContext.Current.CancellationToken;
        var r1 = await ch1.Reader.ReadAsync(ct);
        var r2 = await ch2.Reader.ReadAsync(ct);
        Assert.Equal(snapshot.Id, r1.Id);
        Assert.Equal(snapshot.Id, r2.Id);
    }

    [Fact]
    public void Broadcast_NoSubscribers_DoesNotThrow()
    {
        var session = new HookSession("tok");
        var snapshot = MakeSnapshot();
        // Should not throw — verifying no exception is raised
        session.Broadcast(snapshot);
    }
}
