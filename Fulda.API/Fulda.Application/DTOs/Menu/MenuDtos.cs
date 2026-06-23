namespace Fulda.Application.DTOs.Menu;

public record MenuCategoryDto(
    int Id,
    string Name,
    string? NameDe,
    string? NameKa,
    int DisplayOrder,
    bool IsActive,
    IEnumerable<MenuItemDto> Items);

public record MenuItemDto(
    int Id,
    int CategoryId,
    string Name,
    string? NameDe,
    string? NameKa,
    string? Description,
    string? DescriptionDe,
    string? DescriptionKa,
    decimal Price,
    string? ImageUrl,
    bool IsAvailable,
    int DisplayOrder);

public record CreateMenuCategoryRequest(
    string Name,
    string? NameDe,
    string? NameKa,
    int DisplayOrder,
    bool IsActive);

public record UpdateMenuCategoryRequest(
    string Name,
    string? NameDe,
    string? NameKa,
    int DisplayOrder,
    bool IsActive);

public record CreateMenuItemRequest(
    int CategoryId,
    string Name,
    string? NameDe,
    string? NameKa,
    string? Description,
    string? DescriptionDe,
    string? DescriptionKa,
    decimal Price,
    string? ImageUrl,
    bool IsAvailable,
    int DisplayOrder);

public record UpdateMenuItemRequest(
    string Name,
    string? NameDe,
    string? NameKa,
    string? Description,
    string? DescriptionDe,
    string? DescriptionKa,
    decimal Price,
    string? ImageUrl,
    bool IsAvailable,
    int DisplayOrder);

public record ReorderRequest(IEnumerable<ReorderItem> Items);

public record ReorderItem(int Id, int DisplayOrder);
