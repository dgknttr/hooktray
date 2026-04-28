FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY HookTray.Api/ .
RUN dotnet publish HookTray.Api.csproj -c Release -o /publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /publish .
ENV ASPNETCORE_HTTP_PORTS=8080
ENTRYPOINT ["dotnet", "HookTray.Api.dll"]
