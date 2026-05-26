using Dapper;
using Fulda.Infrastructure.Data;

namespace Fulda.Infrastructure.Data;

public class DatabaseSeeder
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public DatabaseSeeder(ISqlConnectionFactory connectionFactory) =>
        _connectionFactory = connectionFactory;

    public async Task SeedAdminUserAsync(CancellationToken ct = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        var exists = await connection.ExecuteScalarAsync<int>(
            "SELECT COUNT(1) FROM AdminUsers WHERE Username = @Username",
            new { Username = "admin" });

        if (exists > 0) return;

        var hash = BCrypt.Net.BCrypt.HashPassword("Admin123!");
        await connection.ExecuteAsync(
            """
            INSERT INTO AdminUsers (Username, PasswordHash, Email, Role, IsActive)
            VALUES (@Username, @PasswordHash, @Email, @Role, 1)
            """,
            new
            {
                Username = "admin",
                PasswordHash = hash,
                Email = "admin@am-stockhaus.de",
                Role = "Admin"
            });
    }
}
