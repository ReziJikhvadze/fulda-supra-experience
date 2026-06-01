namespace Fulda.Application.Interfaces.Services;

public interface IBlobStorageService
{
    Task<string> UploadAsync(Stream stream, string fileName, string contentType, CancellationToken ct = default);

    /// <summary>Upload using a fixed blob path (re-runs overwrite the same blob).</summary>
    Task<string> UploadAsync(Stream stream, string fileName, string contentType, string blobPath, CancellationToken ct = default);

    Task DeleteAsync(string fileUrl, CancellationToken ct = default);
}
