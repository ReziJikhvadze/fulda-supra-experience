namespace Fulda.Domain.Entities;

public class SiteImage
{
    public string Key { get; set; } = string.Empty;
    public string? ImageData { get; set; }
    public DateTime UpdatedAt { get; set; }
}
