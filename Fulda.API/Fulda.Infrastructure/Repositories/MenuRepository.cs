using Dapper;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Domain.Entities;
using Fulda.Infrastructure.Data;

namespace Fulda.Infrastructure.Repositories;

public class MenuRepository : IMenuRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public MenuRepository(ISqlConnectionFactory connectionFactory) =>
        _connectionFactory = connectionFactory;

    public async Task<IReadOnlyList<MenuCategory>> GetCategoriesAsync(bool activeOnly = false, CancellationToken ct = default)
    {
        var sql = "SELECT Id, Name, NameDe, NameKa, DisplayOrder, IsActive FROM MenuCategories";
        if (activeOnly) sql += " WHERE IsActive = 1";
        sql += " ORDER BY DisplayOrder";

        using var connection = _connectionFactory.CreateConnection();
        var rows = await connection.QueryAsync<MenuCategory>(sql);
        return rows.ToList();
    }

    public async Task<MenuCategory?> GetCategoryByIdAsync(int id, CancellationToken ct = default)
    {
        const string sql = "SELECT Id, Name, NameDe, NameKa, DisplayOrder, IsActive FROM MenuCategories WHERE Id = @Id";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<MenuCategory>(sql, new { Id = id });
    }

    public async Task<MenuCategory?> GetCategoryByNameAsync(string name, CancellationToken ct = default)
    {
        const string sql = "SELECT Id, Name, NameDe, NameKa, DisplayOrder, IsActive FROM MenuCategories WHERE Name = @Name";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<MenuCategory>(sql, new { Name = name });
    }

    public async Task<int> CreateCategoryAsync(MenuCategory category, CancellationToken ct = default)
    {
        const string sql = """
            INSERT INTO MenuCategories (Name, NameDe, NameKa, DisplayOrder, IsActive)
            VALUES (@Name, @NameDe, @NameKa, @DisplayOrder, @IsActive);
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(sql, category);
    }

    public async Task<bool> UpdateCategoryAsync(MenuCategory category, CancellationToken ct = default)
    {
        const string sql = """
            UPDATE MenuCategories SET Name = @Name, NameDe = @NameDe, NameKa = @NameKa,
                DisplayOrder = @DisplayOrder, IsActive = @IsActive
            WHERE Id = @Id
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync(sql, category) > 0;
    }

    public async Task<bool> DeleteCategoryAsync(int id, CancellationToken ct = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync("DELETE FROM MenuCategories WHERE Id = @Id", new { Id = id }) > 0;
    }

    public async Task ReorderCategoriesAsync(IEnumerable<(int Id, int DisplayOrder)> items, CancellationToken ct = default)
    {
        const string sql = "UPDATE MenuCategories SET DisplayOrder = @DisplayOrder WHERE Id = @Id";
        using var connection = _connectionFactory.CreateConnection();
        foreach (var item in items)
            await connection.ExecuteAsync(sql, new { item.Id, item.DisplayOrder });
    }

    public async Task<IReadOnlyList<MenuItem>> GetItemsByCategoryAsync(int categoryId, CancellationToken ct = default)
    {
        const string sql = """
            SELECT Id, CategoryId, Name, NameDe, NameKa, Description, DescriptionDe, DescriptionKa,
                Price, ImageUrl, IsAvailable, DisplayOrder
            FROM MenuItems WHERE CategoryId = @CategoryId ORDER BY DisplayOrder
            """;
        using var connection = _connectionFactory.CreateConnection();
        var rows = await connection.QueryAsync<MenuItem>(sql, new { CategoryId = categoryId });
        return rows.ToList();
    }

    public async Task<IReadOnlyList<MenuItem>> GetAllItemsAsync(bool availableOnly = false, CancellationToken ct = default)
    {
        var sql = """
            SELECT Id, CategoryId, Name, NameDe, NameKa, Description, DescriptionDe, DescriptionKa,
                Price, ImageUrl, IsAvailable, DisplayOrder
            FROM MenuItems
            """;
        if (availableOnly) sql += " WHERE IsAvailable = 1";
        sql += " ORDER BY DisplayOrder";

        using var connection = _connectionFactory.CreateConnection();
        var rows = await connection.QueryAsync<MenuItem>(sql);
        return rows.ToList();
    }

    public async Task<MenuItem?> GetItemByIdAsync(int id, CancellationToken ct = default)
    {
        const string sql = """
            SELECT Id, CategoryId, Name, NameDe, NameKa, Description, DescriptionDe, DescriptionKa,
                Price, ImageUrl, IsAvailable, DisplayOrder
            FROM MenuItems WHERE Id = @Id
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<MenuItem>(sql, new { Id = id });
    }

    public async Task<int> CreateItemAsync(MenuItem item, CancellationToken ct = default)
    {
        const string sql = """
            INSERT INTO MenuItems (CategoryId, Name, NameDe, NameKa, Description, DescriptionDe, DescriptionKa,
                Price, ImageUrl, IsAvailable, DisplayOrder)
            VALUES (@CategoryId, @Name, @NameDe, @NameKa, @Description, @DescriptionDe, @DescriptionKa,
                @Price, @ImageUrl, @IsAvailable, @DisplayOrder);
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(sql, item);
    }

    public async Task<bool> UpdateItemAsync(MenuItem item, CancellationToken ct = default)
    {
        const string sql = """
            UPDATE MenuItems SET CategoryId = @CategoryId, Name = @Name, NameDe = @NameDe, NameKa = @NameKa,
                Description = @Description, DescriptionDe = @DescriptionDe, DescriptionKa = @DescriptionKa,
                Price = @Price, ImageUrl = @ImageUrl, IsAvailable = @IsAvailable, DisplayOrder = @DisplayOrder
            WHERE Id = @Id
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync(sql, item) > 0;
    }

    public async Task<bool> DeleteItemAsync(int id, CancellationToken ct = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync("DELETE FROM MenuItems WHERE Id = @Id", new { Id = id }) > 0;
    }

    public async Task ReorderItemsAsync(IEnumerable<(int Id, int DisplayOrder)> items, CancellationToken ct = default)
    {
        const string sql = "UPDATE MenuItems SET DisplayOrder = @DisplayOrder WHERE Id = @Id";
        using var connection = _connectionFactory.CreateConnection();
        foreach (var item in items)
            await connection.ExecuteAsync(sql, new { item.Id, item.DisplayOrder });
    }
}
