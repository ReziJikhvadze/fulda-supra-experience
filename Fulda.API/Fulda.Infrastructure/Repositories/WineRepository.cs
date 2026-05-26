using Dapper;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Domain.Entities;
using Fulda.Infrastructure.Data;

namespace Fulda.Infrastructure.Repositories;

public class WineRepository : IWineRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public WineRepository(ISqlConnectionFactory connectionFactory) =>
        _connectionFactory = connectionFactory;

    public async Task<IReadOnlyList<WineCategory>> GetCategoriesAsync(CancellationToken ct = default)
    {
        const string sql = "SELECT Id, Name, DisplayOrder FROM WineCategories ORDER BY DisplayOrder";
        using var connection = _connectionFactory.CreateConnection();
        var rows = await connection.QueryAsync<WineCategory>(sql);
        return rows.ToList();
    }

    public async Task<WineCategory?> GetCategoryByIdAsync(int id, CancellationToken ct = default)
    {
        const string sql = "SELECT Id, Name, DisplayOrder FROM WineCategories WHERE Id = @Id";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<WineCategory>(sql, new { Id = id });
    }

    public async Task<int> CreateCategoryAsync(WineCategory category, CancellationToken ct = default)
    {
        const string sql = """
            INSERT INTO WineCategories (Name, DisplayOrder) VALUES (@Name, @DisplayOrder);
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(sql, category);
    }

    public async Task<bool> UpdateCategoryAsync(WineCategory category, CancellationToken ct = default)
    {
        const string sql = "UPDATE WineCategories SET Name = @Name, DisplayOrder = @DisplayOrder WHERE Id = @Id";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync(sql, category) > 0;
    }

    public async Task<bool> DeleteCategoryAsync(int id, CancellationToken ct = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync("DELETE FROM WineCategories WHERE Id = @Id", new { Id = id }) > 0;
    }

    public async Task<IReadOnlyList<Wine>> GetWinesByCategoryAsync(int categoryId, CancellationToken ct = default)
    {
        const string sql = """
            SELECT Id, CategoryId, Name, Description, Price, Country, Year, ImageUrl, IsAvailable
            FROM Wines WHERE CategoryId = @CategoryId ORDER BY Name
            """;
        using var connection = _connectionFactory.CreateConnection();
        var rows = await connection.QueryAsync<Wine>(sql, new { CategoryId = categoryId });
        return rows.ToList();
    }

    public async Task<IReadOnlyList<Wine>> GetAllWinesAsync(bool availableOnly = false, CancellationToken ct = default)
    {
        var sql = """
            SELECT Id, CategoryId, Name, Description, Price, Country, Year, ImageUrl, IsAvailable FROM Wines
            """;
        if (availableOnly) sql += " WHERE IsAvailable = 1";

        using var connection = _connectionFactory.CreateConnection();
        var rows = await connection.QueryAsync<Wine>(sql);
        return rows.ToList();
    }

    public async Task<Wine?> GetWineByIdAsync(int id, CancellationToken ct = default)
    {
        const string sql = """
            SELECT Id, CategoryId, Name, Description, Price, Country, Year, ImageUrl, IsAvailable
            FROM Wines WHERE Id = @Id
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Wine>(sql, new { Id = id });
    }

    public async Task<int> CreateWineAsync(Wine wine, CancellationToken ct = default)
    {
        const string sql = """
            INSERT INTO Wines (CategoryId, Name, Description, Price, Country, Year, ImageUrl, IsAvailable)
            VALUES (@CategoryId, @Name, @Description, @Price, @Country, @Year, @ImageUrl, @IsAvailable);
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(sql, wine);
    }

    public async Task<bool> UpdateWineAsync(Wine wine, CancellationToken ct = default)
    {
        const string sql = """
            UPDATE Wines SET CategoryId = @CategoryId, Name = @Name, Description = @Description,
                Price = @Price, Country = @Country, Year = @Year, ImageUrl = @ImageUrl, IsAvailable = @IsAvailable
            WHERE Id = @Id
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync(sql, wine) > 0;
    }

    public async Task<bool> DeleteWineAsync(int id, CancellationToken ct = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync("DELETE FROM Wines WHERE Id = @Id", new { Id = id }) > 0;
    }
}
