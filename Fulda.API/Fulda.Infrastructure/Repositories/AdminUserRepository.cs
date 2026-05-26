using Dapper;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Domain.Entities;
using Fulda.Infrastructure.Data;

namespace Fulda.Infrastructure.Repositories;

public class AdminUserRepository : IAdminUserRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public AdminUserRepository(ISqlConnectionFactory connectionFactory) =>
        _connectionFactory = connectionFactory;

    public async Task<AdminUser?> GetByUsernameAsync(string username, CancellationToken ct = default)
    {
        const string sql = """
            SELECT Id, Username, PasswordHash, Email, Role, IsActive
            FROM AdminUsers WHERE Username = @Username AND IsActive = 1
            """;
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<AdminUser>(sql, new { Username = username });
    }
}
