namespace Fulda.Domain.Entities;

public class Wine
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Country { get; set; }
    public int? Year { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; }
}
