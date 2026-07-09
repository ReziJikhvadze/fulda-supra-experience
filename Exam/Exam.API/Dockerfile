# ---- build stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Exam.API.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish Exam.API.csproj -c Release -o /app /p:UseAppHost=false

# ---- runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app ./

EXPOSE 8080
# Render provides the $PORT env var at runtime; fall back to 8080 for local docker runs.
CMD ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet Exam.API.dll
