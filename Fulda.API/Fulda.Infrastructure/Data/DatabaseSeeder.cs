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

    public async Task SeedSignaturePlatesCategoryAsync(CancellationToken ct = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        var exists = await connection.ExecuteScalarAsync<int>(
            "SELECT COUNT(1) FROM MenuCategories WHERE Name = @Name",
            new { Name = "Signature Plates" });

        if (exists > 0) return;

        var categoryId = await connection.ExecuteScalarAsync<int>(
            """
            INSERT INTO MenuCategories (Name, DisplayOrder, IsActive)
            VALUES (@Name, 0, 1);
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """,
            new { Name = "Signature Plates" });

        await connection.ExecuteAsync(
            """
            INSERT INTO MenuItems (CategoryId, Name, Description, Price, IsAvailable, DisplayOrder) VALUES
            (@CategoryId, N'Adjaruli Khachapuri', N'Boat-shaped bread with egg and butter.', 14.50, 1, 1),
            (@CategoryId, N'Beef Khinkali', N'Handmade dumplings with spiced beef.', 16.00, 1, 2),
            (@CategoryId, N'Mtsvadi', N'Georgian pork skewers with tkemali.', 22.00, 1, 3),
            (@CategoryId, N'Lobio', N'Red bean stew with herbs.', 13.50, 1, 4),
            (@CategoryId, N'Pkhali', N'Spinach and walnut pate with pomegranate.', 11.50, 1, 5),
            (@CategoryId, N'Badrijani', N'Fried eggplant rolls with walnut paste.', 12.50, 1, 6),
            (@CategoryId, N'Georgian Salad', N'Tomatoes, cucumber, walnuts, herbs.', 10.00, 1, 7),
            (@CategoryId, N'Churchkhela', N'Grape must and nut candle.', 6.50, 1, 8);
            """,
            new { CategoryId = categoryId });
    }
}
