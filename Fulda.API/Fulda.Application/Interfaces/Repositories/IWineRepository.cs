using Fulda.Domain.Entities;

namespace Fulda.Application.Interfaces.Repositories;

public interface IWineRepository
{
    Task<IReadOnlyList<WineCategory>> GetCategoriesAsync(CancellationToken ct = default);
    Task<WineCategory?> GetCategoryByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateCategoryAsync(WineCategory category, CancellationToken ct = default);
    Task<bool> UpdateCategoryAsync(WineCategory category, CancellationToken ct = default);
    Task<bool> DeleteCategoryAsync(int id, CancellationToken ct = default);

    Task<IReadOnlyList<Wine>> GetWinesByCategoryAsync(int categoryId, CancellationToken ct = default);
    Task<IReadOnlyList<Wine>> GetAllWinesAsync(bool availableOnly = false, CancellationToken ct = default);
    Task<Wine?> GetWineByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateWineAsync(Wine wine, CancellationToken ct = default);
    Task<bool> UpdateWineAsync(Wine wine, CancellationToken ct = default);
    Task<bool> DeleteWineAsync(int id, CancellationToken ct = default);
}
