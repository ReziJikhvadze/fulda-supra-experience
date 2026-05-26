using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Fulda.Application.Interfaces.Services;
using Fulda.Infrastructure.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Fulda.Infrastructure.Storage;

public class BlobStorageService : IBlobStorageService
{
    private readonly BlobContainerClient _container;
    private readonly BlobStorageSettings _settings;
    private readonly ILogger<BlobStorageService> _logger;

    public BlobStorageService(IOptions<BlobStorageSettings> settings, ILogger<BlobStorageService> logger)
    {
        _settings = settings.Value;
        _logger = logger;

        if (string.IsNullOrWhiteSpace(_settings.ConnectionString))
        {
            _container = null!;
            return;
        }

        var serviceClient = new BlobServiceClient(_settings.ConnectionString);
        _container = serviceClient.GetBlobContainerClient(_settings.ContainerName);
    }

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.ConnectionString))
        {
            var localName = $"{Guid.NewGuid():N}_{Path.GetFileName(fileName)}";
            var localPath = Path.Combine(Path.GetTempPath(), "fulda-uploads", localName);
            Directory.CreateDirectory(Path.GetDirectoryName(localPath)!);
            await using var fileStream = File.Create(localPath);
            await stream.CopyToAsync(fileStream, ct);
            _logger.LogWarning("Azure Storage not configured. Saved upload locally: {Path}", localPath);
            return $"/uploads/{localName}";
        }

        await _container.CreateIfNotExistsAsync(PublicAccessType.Blob, cancellationToken: ct);
        var blobName = $"{Guid.NewGuid():N}_{Path.GetFileName(fileName)}";
        var blobClient = _container.GetBlobClient(blobName);
        await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType }, cancellationToken: ct);
        return blobClient.Uri.ToString();
    }

    public async Task DeleteAsync(string fileUrl, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.ConnectionString) || string.IsNullOrWhiteSpace(fileUrl))
            return;

        try
        {
            var uri = new Uri(fileUrl);
            var blobName = Path.GetFileName(uri.LocalPath);
            await _container.GetBlobClient(blobName).DeleteIfExistsAsync(cancellationToken: ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to delete blob {Url}", fileUrl);
        }
    }
}
