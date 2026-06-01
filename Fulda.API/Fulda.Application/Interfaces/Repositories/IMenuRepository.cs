using Fulda.Domain.Entities;

namespace Fulda.Application.Interfaces.Repositories;

public interface IMenuRepository
{
    Task<IReadOnlyList<MenuCategory>> GetCategoriesAsync(bool activeOnly = false, CancellationToken ct = default);
    Task<MenuCategory?> GetCategoryByIdAsync(int id, CancellationToken ct = default);
    Task<MenuCategory?> GetCategoryByNameAsync(string name, CancellationToken ct = default);
    Task<int> CreateCategoryAsync(MenuCategory category, CancellationToken ct = default);
    Task<bool> UpdateCategoryAsync(MenuCategory category, CancellationToken ct = default);
    Task<bool> DeleteCategoryAsync(int id, CancellationToken ct = default);
    Task ReorderCategoriesAsync(IEnumerable<(int Id, int DisplayOrder)> items, CancellationToken ct = default);

    Task<IReadOnlyList<MenuItem>> GetItemsByCategoryAsync(int categoryId, CancellationToken ct = default);
    Task<IReadOnlyList<MenuItem>> GetAllItemsAsync(bool availableOnly = false, CancellationToken ct = default);
    Task<MenuItem?> GetItemByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateItemAsync(MenuItem item, CancellationToken ct = default);
    Task<bool> UpdateItemAsync(MenuItem item, CancellationToken ct = default);
    Task<bool> DeleteItemAsync(int id, CancellationToken ct = default);
    Task ReorderItemsAsync(IEnumerable<(int Id, int DisplayOrder)> items, CancellationToken ct = default);
}
