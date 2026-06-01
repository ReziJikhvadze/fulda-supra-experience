using Fulda.Application.Common;
using Fulda.Application.DTOs.Images;
using Fulda.Application.Interfaces.Services;
using Fulda.Infrastructure.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Fulda.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ImagesController : ControllerBase
{
    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/jpg", "image/png", "image/webp"
    };

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };

    private readonly IBlobStorageService _blobStorage;
    private readonly BlobStorageSettings _settings;

    public ImagesController(IBlobStorageService blobStorage, IOptions<BlobStorageSettings> settings)
    {
        _blobStorage = blobStorage;
        _settings = settings.Value;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(6 * 1024 * 1024)]
    public async Task<ActionResult<ApiResponse<ImageUploadResponse>>> Upload(IFormFile file, CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest(ApiResponse<ImageUploadResponse>.Fail("No file uploaded."));

        if (file.Length > _settings.MaxFileSizeBytes)
            return BadRequest(ApiResponse<ImageUploadResponse>.Fail(
                $"File size exceeds maximum of {_settings.MaxFileSizeBytes / (1024 * 1024)} MB."));

        var extension = Path.GetExtension(file.FileName);
        if (!AllowedExtensions.Contains(extension) || !AllowedContentTypes.Contains(file.ContentType))
            return BadRequest(ApiResponse<ImageUploadResponse>.Fail("Only JPG, PNG, and WEBP images are allowed."));

        await using var stream = file.OpenReadStream();
        var url = await _blobStorage.UploadAsync(stream, file.FileName, file.ContentType, ct);
        if (url.StartsWith('/'))
            url = $"{Request.Scheme}://{Request.Host}{url}";

        var storageHint = string.IsNullOrWhiteSpace(_settings.ConnectionString)
            ? "Saved on this API server (uploads folder). Set AzureStorage__ConnectionString for Azure Blob."
            : $"Saved to Azure Blob container '{_settings.ContainerName}'.";

        return Ok(ApiResponse<ImageUploadResponse>.Ok(
            new ImageUploadResponse(url, Path.GetFileName(file.FileName)),
            $"Image uploaded. {storageHint}"));
    }

    [HttpDelete]
    public async Task<ActionResult<ApiResponse>> Delete([FromQuery] string url, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(url))
            return BadRequest(ApiResponse.Fail("Image URL is required."));

        await _blobStorage.DeleteAsync(url, ct);
        return Ok(ApiResponse.Ok("Image deleted."));
    }
}
