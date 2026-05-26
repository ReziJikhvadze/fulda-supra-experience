using Fulda.Application.DTOs.Menu;
using Fulda.Application.DTOs.Wine;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Domain.Entities;

namespace Fulda.Application.Services;

public class WineService
{
    private readonly IWineRepository _repository;

    public WineService(IWineRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<WineCategoryDto>> GetPublicWinesAsync(CancellationToken ct = default)
    {
        var categories = await _repository.GetCategoriesAsync(ct);
        var wines = await _repository.GetAllWinesAsync(availableOnly: true, ct);
        return BuildTree(categories, wines);
    }

    public async Task<IReadOnlyList<WineCategoryDto>> GetAdminWinesAsync(CancellationToken ct = default)
    {
        var categories = await _repository.GetCategoriesAsync(ct);
        var wines = await _repository.GetAllWinesAsync(availableOnly: false, ct);
        return BuildTree(categories, wines);
    }

    public async Task<int> CreateCategoryAsync(CreateWineCategoryRequest request, CancellationToken ct = default)
    {
        var entity = new WineCategory { Name = request.Name.Trim(), DisplayOrder = request.DisplayOrder };
        return await _repository.CreateCategoryAsync(entity, ct);
    }

    public async Task<bool> UpdateCategoryAsync(int id, UpdateWineCategoryRequest request, CancellationToken ct = default)
    {
        var existing = await _repository.GetCategoryByIdAsync(id, ct);
        if (existing is null) return false;
        existing.Name = request.Name.Trim();
        existing.DisplayOrder = request.DisplayOrder;
        return await _repository.UpdateCategoryAsync(existing, ct);
    }

    public Task<bool> DeleteCategoryAsync(int id, CancellationToken ct = default) =>
        _repository.DeleteCategoryAsync(id, ct);

    public async Task<int> CreateWineAsync(CreateWineRequest request, CancellationToken ct = default)
    {
        var entity = new Wine
        {
            CategoryId = request.CategoryId,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            Price = request.Price,
            Country = request.Country?.Trim(),
            Year = request.Year,
            ImageUrl = request.ImageUrl,
            IsAvailable = request.IsAvailable
        };
        return await _repository.CreateWineAsync(entity, ct);
    }

    public async Task<bool> UpdateWineAsync(int id, UpdateWineRequest request, CancellationToken ct = default)
    {
        var existing = await _repository.GetWineByIdAsync(id, ct);
        if (existing is null) return false;

        existing.Name = request.Name.Trim();
        existing.Description = request.Description?.Trim();
        existing.Price = request.Price;
        existing.Country = request.Country?.Trim();
        existing.Year = request.Year;
        existing.ImageUrl = request.ImageUrl;
        existing.IsAvailable = request.IsAvailable;
        return await _repository.UpdateWineAsync(existing, ct);
    }

    public Task<bool> DeleteWineAsync(int id, CancellationToken ct = default) =>
        _repository.DeleteWineAsync(id, ct);

    private static IReadOnlyList<WineCategoryDto> BuildTree(
        IReadOnlyList<WineCategory> categories,
        IReadOnlyList<Wine> wines) =>
        categories
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new WineCategoryDto(
                c.Id,
                c.Name,
                c.DisplayOrder,
                wines.Where(w => w.CategoryId == c.Id).Select(MapWine)))
            .ToList();

    private static WineDto MapWine(Wine w) => new(
        w.Id, w.CategoryId, w.Name, w.Description, w.Price, w.Country, w.Year, w.ImageUrl, w.IsAvailable);
}
