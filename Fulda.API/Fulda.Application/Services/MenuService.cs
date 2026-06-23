using Fulda.Application.DTOs.Menu;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Domain.Entities;

namespace Fulda.Application.Services;

public class MenuService
{
    public const string SignaturePlatesCategoryName = "Signature Plates";

    private readonly IMenuRepository _repository;

    public MenuService(IMenuRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<MenuCategoryDto>> GetPublicMenuAsync(CancellationToken ct = default)
    {
        var categories = await _repository.GetCategoriesAsync(activeOnly: true, ct);
        categories = categories
            .Where(c => !IsSignatureCategory(c.Name))
            .ToList();
        var items = await _repository.GetAllItemsAsync(availableOnly: true, ct);
        return BuildTree(categories, items);
    }

    public async Task<IReadOnlyList<MenuItemDto>> GetSignaturePlatesAsync(CancellationToken ct = default)
    {
        var category = await _repository.GetCategoryByNameAsync(SignaturePlatesCategoryName, ct);
        if (category is null || !category.IsActive)
            return Array.Empty<MenuItemDto>();

        var items = await _repository.GetItemsByCategoryAsync(category.Id, ct);
        return items
            .Where(i => i.IsAvailable)
            .OrderBy(i => i.DisplayOrder)
            .Select(MapItem)
            .ToList();
    }

    private static bool IsSignatureCategory(string name) =>
        string.Equals(name, SignaturePlatesCategoryName, StringComparison.OrdinalIgnoreCase);

    public async Task<IReadOnlyList<MenuCategoryDto>> GetAdminMenuAsync(CancellationToken ct = default)
    {
        var categories = await _repository.GetCategoriesAsync(activeOnly: false, ct);
        var items = await _repository.GetAllItemsAsync(availableOnly: false, ct);
        return BuildTree(categories, items);
    }

    public async Task<MenuCategoryDto?> GetCategoryAsync(int id, CancellationToken ct = default)
    {
        var category = await _repository.GetCategoryByIdAsync(id, ct);
        if (category is null) return null;
        var items = await _repository.GetItemsByCategoryAsync(id, ct);
        return MapCategory(category, items);
    }

    public async Task<int> CreateCategoryAsync(CreateMenuCategoryRequest request, CancellationToken ct = default)
    {
        var entity = new MenuCategory
        {
            Name = request.Name.Trim(),
            NameDe = Clean(request.NameDe),
            NameKa = Clean(request.NameKa),
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive
        };
        return await _repository.CreateCategoryAsync(entity, ct);
    }

    public async Task<bool> UpdateCategoryAsync(int id, UpdateMenuCategoryRequest request, CancellationToken ct = default)
    {
        var existing = await _repository.GetCategoryByIdAsync(id, ct);
        if (existing is null) return false;

        existing.Name = request.Name.Trim();
        existing.NameDe = Clean(request.NameDe);
        existing.NameKa = Clean(request.NameKa);
        existing.DisplayOrder = request.DisplayOrder;
        existing.IsActive = request.IsActive;
        return await _repository.UpdateCategoryAsync(existing, ct);
    }

    public Task<bool> DeleteCategoryAsync(int id, CancellationToken ct = default) =>
        _repository.DeleteCategoryAsync(id, ct);

    public Task ReorderCategoriesAsync(ReorderRequest request, CancellationToken ct = default) =>
        _repository.ReorderCategoriesAsync(request.Items.Select(i => (i.Id, i.DisplayOrder)), ct);

    public async Task<int> CreateItemAsync(CreateMenuItemRequest request, CancellationToken ct = default)
    {
        var entity = new MenuItem
        {
            CategoryId = request.CategoryId,
            Name = request.Name.Trim(),
            NameDe = Clean(request.NameDe),
            NameKa = Clean(request.NameKa),
            Description = Clean(request.Description),
            DescriptionDe = Clean(request.DescriptionDe),
            DescriptionKa = Clean(request.DescriptionKa),
            Price = request.Price,
            ImageUrl = request.ImageUrl,
            IsAvailable = request.IsAvailable,
            DisplayOrder = request.DisplayOrder
        };
        return await _repository.CreateItemAsync(entity, ct);
    }

    public async Task<bool> UpdateItemAsync(int id, UpdateMenuItemRequest request, CancellationToken ct = default)
    {
        var existing = await _repository.GetItemByIdAsync(id, ct);
        if (existing is null) return false;

        existing.Name = request.Name.Trim();
        existing.NameDe = Clean(request.NameDe);
        existing.NameKa = Clean(request.NameKa);
        existing.Description = Clean(request.Description);
        existing.DescriptionDe = Clean(request.DescriptionDe);
        existing.DescriptionKa = Clean(request.DescriptionKa);
        existing.Price = request.Price;
        existing.ImageUrl = request.ImageUrl;
        existing.IsAvailable = request.IsAvailable;
        existing.DisplayOrder = request.DisplayOrder;
        return await _repository.UpdateItemAsync(existing, ct);
    }

    public Task<bool> DeleteItemAsync(int id, CancellationToken ct = default) =>
        _repository.DeleteItemAsync(id, ct);

    public Task ReorderItemsAsync(ReorderRequest request, CancellationToken ct = default) =>
        _repository.ReorderItemsAsync(request.Items.Select(i => (i.Id, i.DisplayOrder)), ct);

    private static IReadOnlyList<MenuCategoryDto> BuildTree(
        IReadOnlyList<MenuCategory> categories,
        IReadOnlyList<MenuItem> items) =>
        categories
            .OrderBy(c => c.DisplayOrder)
            .Select(c => MapCategory(c, items.Where(i => i.CategoryId == c.Id).OrderBy(i => i.DisplayOrder)))
            .ToList();

    private static MenuCategoryDto MapCategory(MenuCategory c, IEnumerable<MenuItem> items) => new(
        c.Id,
        c.Name,
        c.NameDe,
        c.NameKa,
        c.DisplayOrder,
        c.IsActive,
        items.Select(MapItem).ToList());

    private static MenuItemDto MapItem(MenuItem i) => new(
        i.Id,
        i.CategoryId,
        i.Name,
        i.NameDe,
        i.NameKa,
        i.Description,
        i.DescriptionDe,
        i.DescriptionKa,
        i.Price,
        i.ImageUrl,
        i.IsAvailable,
        i.DisplayOrder);

    private static string? Clean(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }
}
