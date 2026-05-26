using Fulda.Application.DTOs.Menu;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Domain.Entities;

namespace Fulda.Application.Services;

public class MenuService
{
    private readonly IMenuRepository _repository;

    public MenuService(IMenuRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<MenuCategoryDto>> GetPublicMenuAsync(CancellationToken ct = default)
    {
        var categories = await _repository.GetCategoriesAsync(activeOnly: true, ct);
        var items = await _repository.GetAllItemsAsync(availableOnly: true, ct);
        return BuildTree(categories, items);
    }

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
            Description = request.Description?.Trim(),
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
        existing.Description = request.Description?.Trim();
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
        c.DisplayOrder,
        c.IsActive,
        items.Select(i => new MenuItemDto(
            i.Id, i.CategoryId, i.Name, i.Description, i.Price, i.ImageUrl, i.IsAvailable, i.DisplayOrder)).ToList());
}
