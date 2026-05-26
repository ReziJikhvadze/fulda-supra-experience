namespace Fulda.Application.DTOs.Wine;

public record WineCategoryDto(int Id, string Name, int DisplayOrder, IEnumerable<WineDto> Wines);

public record WineDto(
    int Id,
    int CategoryId,
    string Name,
    string? Description,
    decimal Price,
    string? Country,
    int? Year,
    string? ImageUrl,
    bool IsAvailable);

public record CreateWineCategoryRequest(string Name, int DisplayOrder);

public record UpdateWineCategoryRequest(string Name, int DisplayOrder);

public record CreateWineRequest(
    int CategoryId,
    string Name,
    string? Description,
    decimal Price,
    string? Country,
    int? Year,
    string? ImageUrl,
    bool IsAvailable);

public record UpdateWineRequest(
    string Name,
    string? Description,
    decimal Price,
    string? Country,
    int? Year,
    string? ImageUrl,
    bool IsAvailable);
