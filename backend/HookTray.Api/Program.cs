using HookTray.Api.Endpoints;
using HookTray.Api.Options;
using HookTray.Api.RateLimiting;
using HookTray.Api.Services;
using HookTray.Api.Sessions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<WebhookOptions>(builder.Configuration.GetSection(WebhookOptions.Section));
builder.Services.Configure<SessionSettings>(builder.Configuration.GetSection(SessionSettings.Section));
builder.Services.Configure<RateLimitOptions>(builder.Configuration.GetSection(RateLimitOptions.Section));

builder.WebHost.ConfigureKestrel((ctx, o) =>
{
    var maxBody = ctx.Configuration.GetSection(WebhookOptions.Section)
        .GetValue<int?>("MaxBodyBytes") ?? 1_048_576;
    o.Limits.MaxRequestBodySize = maxBody;
});

builder.Services.AddSingleton<SessionStore>();
builder.Services.AddSingleton<TokenRateLimiter>();
builder.Services.AddSingleton<IpRateLimiter>();
builder.Services.AddSingleton<RequestSnapshotBuilder>();
builder.Services.AddHostedService<SessionCleanupService>();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(allowedOrigins)
     .AllowAnyHeader()
     .AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));
HooksEndpoint.Map(app);
WebhookEndpoint.Map(app);
StreamEndpoint.Map(app);

app.Run();
