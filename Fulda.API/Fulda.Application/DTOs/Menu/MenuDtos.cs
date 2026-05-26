namespace Fulda.Application.DTOs.Menu;

public record MenuCategoryDto(int Id, string Name, int DisplayOrder, bool IsActive, IEnumerable<MenuItemDto> Items);

public record MenuItemDto(
    int Id,
    int CategoryId,
    string Name,
    string? Description,
    decimal Price,
    string? ImageUrl,
    bool IsAvailable,
    int DisplayOrder);

public record CreateMenuCategoryRequest(string Name, int DisplayOrder, bool IsActive);

public record UpdateMenuCategoryRequest(string Name, int DisplayOrder, bool IsActive);

public record CreateMenuItemRequest(
    int CategoryId,
    string Name,
    string? Description,
    decimal Price,
    string? ImageUrl,
    bool IsAvailable,
    int DisplayOrder);

public record UpdateMenuItemRequest(
    string Name,
    string? Description,
    decimal Price,
    string? ImageUrl,
    bool IsAvailable,
    int DisplayOrder);

public record ReorderRequest(IEnumerable<ReorderItem> Items);

public record ReorderItem(int Id, int DisplayOrder);
