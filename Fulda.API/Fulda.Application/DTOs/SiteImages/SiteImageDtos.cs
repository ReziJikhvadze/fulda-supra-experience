namespace Fulda.Application.DTOs.SiteImages;

public record SiteImagesDto(string? Intro, string? Story);

public record UpdateSiteImageRequest(string? ImageData);
