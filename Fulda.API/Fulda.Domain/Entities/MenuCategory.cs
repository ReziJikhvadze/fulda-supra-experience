namespace Fulda.Domain.Entities;

public class MenuCategory
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? NameDe { get; set; }
    public string? NameKa { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}
