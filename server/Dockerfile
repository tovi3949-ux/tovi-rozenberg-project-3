# Multi-stage build for Linux (.NET 7) with explicit Debian-slim and non-root runtime

# Build stage (Linux)
FROM mcr.microsoft.com/dotnet/sdk:9.0-bookworm-slim AS build
WORKDIR /src

# Copy csproj and restore (better layer cache)
COPY *.csproj ./
RUN dotnet restore

# Copy the rest and publish
COPY . ./
RUN dotnet publish -c Release --no-restore -o /app/publish

# Runtime stage (Linux)
FROM mcr.microsoft.com/dotnet/aspnet:7.0-bookworm-slim AS runtime
WORKDIR /app

# Create non-root user
RUN addgroup --system dotnet && adduser --system --ingroup dotnet app
COPY --from=build /app/publish ./
RUN chown -R app:dotnet /app
USER app

# Bind and expose port 5006 (matches Program.cs)
ENV ASPNETCORE_URLS="http://+:5006"
EXPOSE 5006

ENTRYPOINT ["dotnet", "TodoApi.dll"]		