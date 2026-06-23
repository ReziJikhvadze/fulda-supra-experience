namespace Fulda.Domain.Entities;

public class MenuItem
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? NameDe { get; set; }
    public string? NameKa { get; set; }
    public string? Description { get; set; }
    public string? DescriptionDe { get; set; }
    public string? DescriptionKa { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; }
    public int DisplayOrder { get; set; }
}
