using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Fulda.Application.Interfaces.Services;
using Fulda.Infrastructure.Options;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Fulda.Infrastructure.Storage;

public class BlobStorageService : IBlobStorageService
{
    private readonly BlobContainerClient? _container;
    private readonly BlobStorageSettings _settings;
    private readonly ILogger<BlobStorageService> _logger;
    private readonly string _localUploadsPath;

    public BlobStorageService(
        IOptions<BlobStorageSettings> settings,
        IHostEnvironment environment,
        ILogger<BlobStorageService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
        _localUploadsPath = Path.Combine(environment.ContentRootPath, "uploads");
        Directory.CreateDirectory(_localUploadsPath);

        var connectionString = ResolveConnectionString(out var source);
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            _container = null;
            return;
        }

        try
        {
            var serviceClient = new BlobServiceClient(connectionString);
            _container = serviceClient.GetBlobContainerClient(_settings.ContainerName);
            _logger.LogInformation("Azure Blob storage configured via {Source}", source);
        }
        catch (FormatException ex)
        {
            throw new InvalidOperationException(
                "Azure Storage settings are invalid. Use EITHER:\n" +
                "  AzureStorage__AccountName + AzureStorage__AccountKey (recommended), OR\n" +
                "  AzureStorage__ConnectionString = full string from Access keys (single quotes in PowerShell).\n" +
                "Remove AzureStorage__ConnectionString if you only set AccountKey there by mistake.",
                ex);
        }
    }

    private string? ResolveConnectionString(out string source)
    {
        source = "none";

        if (!string.IsNullOrWhiteSpace(_settings.AccountName) && !string.IsNullOrWhiteSpace(_settings.AccountKey))
        {
            source = "AccountName+AccountKey";
            return
                $"DefaultEndpointsProtocol=https;AccountName={_settings.AccountName.Trim()};" +
                $"AccountKey={_settings.AccountKey.Trim()};EndpointSuffix=core.windows.net";
        }

        var configured = _settings.ConnectionString.Trim();
        if (!string.IsNullOrWhiteSpace(configured) && LooksLikeBlobConnectionString(configured))
        {
            source = "ConnectionString";
            return configured;
        }

        if (!string.IsNullOrWhiteSpace(configured))
        {
            _logger.LogWarning(
                "AzureStorage:ConnectionString is set but invalid for blob storage (wrong format?). " +
                "Use AccountName+AccountKey or the full connection string from Access keys.");
        }

        return null;
    }

    private static bool LooksLikeBlobConnectionString(string value) =>
        value.Contains("AccountName=", StringComparison.OrdinalIgnoreCase) &&
        value.Contains("AccountKey=", StringComparison.OrdinalIgnoreCase);

    public Task<string> UploadAsync(Stream stream, string fileName, string contentType, CancellationToken ct = default) =>
        UploadCoreAsync(stream, fileName, contentType, blobPath: null, ct);

    public Task<string> UploadAsync(Stream stream, string fileName, string contentType, string blobPath, CancellationToken ct = default) =>
        UploadCoreAsync(stream, fileName, contentType, blobPath, ct);

    private async Task<string> UploadCoreAsync(
        Stream stream,
        string fileName,
        string contentType,
        string? blobPath,
        CancellationToken ct)
    {
        var storageName = string.IsNullOrWhiteSpace(blobPath)
            ? $"{Guid.NewGuid():N}_{Path.GetFileName(fileName)}"
            : blobPath.Replace('\\', '/').TrimStart('/');

        if (_container is null)
        {
            var localPath = Path.Combine(_localUploadsPath, storageName.Replace('/', Path.DirectorySeparatorChar));
            Directory.CreateDirectory(Path.GetDirectoryName(localPath)!);
            await using var fileStream = File.Create(localPath);
            await stream.CopyToAsync(fileStream, ct);
            _logger.LogWarning(
                "Azure Storage not configured. Saved to {Path} (served at /uploads/)",
                localPath);
            return $"/uploads/{storageName.Replace('\\', '/')}";
        }

        await _container.CreateIfNotExistsAsync(PublicAccessType.Blob, cancellationToken: ct);
        var blobClient = _container.GetBlobClient(storageName);
        await blobClient.UploadAsync(
            stream,
            new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders { ContentType = contentType }
            },
            ct);
        return blobClient.Uri.ToString();
    }

    public async Task DeleteAsync(string fileUrl, CancellationToken ct = default)
    {
        if (_container is null || string.IsNullOrWhiteSpace(fileUrl))
            return;

        try
        {
            var uri = new Uri(fileUrl);
            var blobName = uri.AbsolutePath.TrimStart('/').Split('/').Last();
            await _container.GetBlobClient(blobName).DeleteIfExistsAsync(cancellationToken: ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to delete blob {Url}", fileUrl);
        }
    }
}
