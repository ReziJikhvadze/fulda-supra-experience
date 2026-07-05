using Dapper;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Domain.Entities;
using Fulda.Infrastructure.Data;

namespace Fulda.Infrastructure.Repositories;

public class SiteImageRepository : ISiteImageRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public SiteImageRepository(ISqlConnectionFactory connectionFactory) =>
        _connectionFactory = connectionFactory;

    public async Task<IReadOnlyList<SiteImage>> GetAllAsync(CancellationToken ct = default)
    {
        const string sql = "SELECT [Key], ImageData, UpdatedAt FROM SiteImages ORDER BY [Key]";
        using var connection = _connectionFactory.CreateConnection();
        var rows = await connection.QueryAsync<SiteImage>(sql);
        return rows.ToList();
    }

    public async Task<SiteImage?> GetByKeyAsync(string key, CancellationToken ct = default)
    {
        const string sql = "SELECT [Key], ImageData, UpdatedAt FROM SiteImages WHERE [Key] = @Key";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<SiteImage>(sql, new { Key = key });
    }

    public async Task UpsertAsync(string key, string? imageData, CancellationToken ct = default)
    {
        const string sql = """
            MERGE SiteImages AS target
            USING (SELECT @Key AS [Key]) AS source
            ON target.[Key] = source.[Key]
            WHEN MATCHED THEN
                UPDATE SET ImageData = @ImageData, UpdatedAt = SYSUTCDATETIME()
            WHEN NOT MATCHED THEN
                INSERT ([Key], ImageData, UpdatedAt) VALUES (@Key, @ImageData, SYSUTCDATETIME());
            """;
        using var connection = _connectionFactory.CreateConnection();
        await connection.ExecuteAsync(sql, new { Key = key, ImageData = imageData });
    }
}
