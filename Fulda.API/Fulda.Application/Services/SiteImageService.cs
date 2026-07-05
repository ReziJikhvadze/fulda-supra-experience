using System.Text.RegularExpressions;
using Fulda.Application.DTOs.SiteImages;
using Fulda.Application.Interfaces.Repositories;

namespace Fulda.Application.Services;

public class SiteImageService
{
    public const int MaxImageDataLength = 7_500_000; // ~5 MB image as base64

    private static readonly HashSet<string> AllowedKeys = new(StringComparer.OrdinalIgnoreCase)
    {
        "intro", "story"
    };

    private static readonly Regex DataUrlPattern = new(
        @"^data:image/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=\s]+$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    private readonly ISiteImageRepository _repository;

    public SiteImageService(ISiteImageRepository repository) => _repository = repository;

    public async Task<SiteImagesDto> GetPublicAsync(CancellationToken ct = default)
    {
        var rows = await _repository.GetAllAsync(ct);
        return new SiteImagesDto(
            rows.FirstOrDefault(r => r.Key.Equals("intro", StringComparison.OrdinalIgnoreCase))?.ImageData,
            rows.FirstOrDefault(r => r.Key.Equals("story", StringComparison.OrdinalIgnoreCase))?.ImageData);
    }

    public async Task<bool> UpdateAsync(string key, UpdateSiteImageRequest request, CancellationToken ct = default)
    {
        if (!AllowedKeys.Contains(key))
            return false;

        var imageData = request.ImageData?.Trim();
        if (string.IsNullOrEmpty(imageData))
        {
            await _repository.UpsertAsync(key, null, ct);
            return true;
        }

        if (imageData.Length > MaxImageDataLength)
            throw new InvalidOperationException("Image is too large. Use a file under 5 MB.");

        if (!DataUrlPattern.IsMatch(imageData))
            throw new InvalidOperationException("Invalid image format. Use JPG, PNG, or WEBP.");

        await _repository.UpsertAsync(key, imageData, ct);
        return true;
    }
}
