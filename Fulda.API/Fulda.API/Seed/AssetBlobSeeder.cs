using System.Text.Json;
using Dapper;
using Fulda.Application.Interfaces.Services;
using Fulda.Infrastructure.Data;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Fulda.API.Seed;

public sealed class AssetBlobSeeder
{
    private readonly IBlobStorageService _blobStorage;
    private readonly ISqlConnectionFactory _sql;
    private readonly IHostEnvironment _environment;
    private readonly ILogger<AssetBlobSeeder> _logger;

    public AssetBlobSeeder(
        IBlobStorageService blobStorage,
        ISqlConnectionFactory sql,
        IHostEnvironment environment,
        ILogger<AssetBlobSeeder> logger)
    {
        _blobStorage = blobStorage;
        _sql = sql;
        _environment = environment;
        _logger = logger;
    }

    public async Task RunAsync(CancellationToken ct = default)
    {
        if (!_sql.IsConfigured)
        {
            _logger.LogError("Database connection string is not configured.");
            return;
        }

        var assetsDir = Path.Combine(_environment.ContentRootPath, "wwwroot", "src", "assets");
        if (!Directory.Exists(assetsDir))
        {
            _logger.LogError("Assets folder not found: {Path}", assetsDir);
            return;
        }

        var mapPath = Path.Combine(_environment.ContentRootPath, "Seed", "image-asset-map.json");
        if (!File.Exists(mapPath))
        {
            _logger.LogError("Mapping file not found: {Path}", mapPath);
            return;
        }

        var entries = JsonSerializer.Deserialize<List<ImageAssetMapEntry>>(
            await File.ReadAllTextAsync(mapPath, ct),
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (entries is null or { Count: 0 })
        {
            _logger.LogWarning("No entries in image-asset-map.json");
            return;
        }

        using var connection = _sql.CreateConnection();
        var uploaded = 0;
        var menuUpdated = 0;

        foreach (var entry in entries)
        {
            var filePath = Path.Combine(assetsDir, entry.Asset);
            if (!File.Exists(filePath))
            {
                _logger.LogWarning("Skip missing asset: {File}", entry.Asset);
                continue;
            }

            await using var stream = File.OpenRead(filePath);
            var contentType = GetContentType(filePath);
            var url = await _blobStorage.UploadAsync(stream, entry.Asset, contentType, entry.BlobPath, ct);
            uploaded++;
            _logger.LogInformation("Uploaded {Asset} -> {Url}", entry.Asset, url);

            if (entry.MenuItemNames.Count == 0)
                continue;

            foreach (var name in entry.MenuItemNames)
            {
                var rows = await connection.ExecuteAsync(
                    "UPDATE MenuItems SET ImageUrl = @ImageUrl WHERE Name = @Name",
                    new { ImageUrl = url, Name = name });
                menuUpdated += rows;
                if (rows == 0)
                    _logger.LogWarning("No menu item named '{Name}' — add it in admin or fix image-asset-map.json", name);
            }
        }

        _logger.LogInformation(
            "Done. Uploaded {Uploaded} file(s) to blob storage; updated {MenuUpdated} menu row(s).",
            uploaded,
            menuUpdated);
    }

    private static string GetContentType(string path) =>
        Path.GetExtension(path).ToLowerInvariant() switch
        {
            ".png" => "image/png",
            ".webp" => "image/webp",
            _ => "image/jpeg"
        };

    private sealed class ImageAssetMapEntry
    {
        public string Asset { get; set; } = "";
        public string BlobPath { get; set; } = "";
        public List<string> MenuItemNames { get; set; } = [];
    }
}
