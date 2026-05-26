using Dapper;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Domain.Entities;
using Fulda.Infrastructure.Data;

namespace Fulda.Infrastructure.Repositories;

public class StaffRepository : IStaffRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public StaffRepository(ISqlConnectionFactory connectionFactory) =>
        _connectionFactory = connectionFactory;

    public async Task<IReadOnlyList<StaffMember>> GetAllAsync(bool activeOnly = false, CancellationToken ct = default)
    {
        var sql = """
            SELECT Id, FullName, Position, Bio, ImageUrl, DisplayOrder, IsActive FROM StaffMembers
            """;
        if (activeOnly) sql += " WHERE IsActive = 1";
        sql += " ORDER BY DisplayOrder";

        using var connection = _connectionFactory.CreateConnection();
        var rows = await connection.QueryAsync<StaffMember>(sql);
        return rows.ToList();
    }

    public async Task<StaffMember?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        const string sql = """
            SELECT Id, FullName, Position, Bio, ImageUrl, DisplayOrder, IsActive
            FROM StaffMembers WHERE Id = @Id
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<StaffMember>(sql, new { Id = id });
    }

    public async Task<int> CreateAsync(StaffMember member, CancellationToken ct = default)
    {
        const string sql = """
            INSERT INTO StaffMembers (FullName, Position, Bio, ImageUrl, DisplayOrder, IsActive)
            VALUES (@FullName, @Position, @Bio, @ImageUrl, @DisplayOrder, @IsActive);
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(sql, member);
    }

    public async Task<bool> UpdateAsync(StaffMember member, CancellationToken ct = default)
    {
        const string sql = """
            UPDATE StaffMembers SET FullName = @FullName, Position = @Position, Bio = @Bio,
                ImageUrl = @ImageUrl, DisplayOrder = @DisplayOrder, IsActive = @IsActive
            WHERE Id = @Id
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync(sql, member) > 0;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync("DELETE FROM StaffMembers WHERE Id = @Id", new { Id = id }) > 0;
    }

    public async Task ReorderAsync(IEnumerable<(int Id, int DisplayOrder)> items, CancellationToken ct = default)
    {
        const string sql = "UPDATE StaffMembers SET DisplayOrder = @DisplayOrder WHERE Id = @Id";
        using var connection = _connectionFactory.CreateConnection();
        foreach (var item in items)
            await connection.ExecuteAsync(sql, new { item.Id, item.DisplayOrder });
    }
}
