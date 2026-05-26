using Dapper;
using Fulda.Application.DTOs.Reservations;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Domain.Entities;
using Fulda.Domain.Enums;
using Fulda.Infrastructure.Data;

namespace Fulda.Infrastructure.Repositories;

public class ReservationRepository : IReservationRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public ReservationRepository(ISqlConnectionFactory connectionFactory) =>
        _connectionFactory = connectionFactory;

    public async Task<IReadOnlyList<Reservation>> GetAllAsync(ReservationFilter? filter = null, CancellationToken ct = default)
    {
        var sql = """
            SELECT Id, CustomerName, Email, Phone, ReservationDate, ReservationTime,
                   GuestCount, SpecialRequest, Status, CreatedAt, UpdatedAt
            FROM Reservations
            WHERE 1=1
            """;

        var parameters = new DynamicParameters();

        if (!string.IsNullOrWhiteSpace(filter?.Search))
        {
            sql += " AND (CustomerName LIKE @Search OR Email LIKE @Search OR Phone LIKE @Search)";
            parameters.Add("Search", $"%{filter.Search.Trim()}%");
        }

        if (filter?.Date is not null)
        {
            sql += " AND ReservationDate = @Date";
            parameters.Add("Date", filter.Date.Value.ToDateTime(TimeOnly.MinValue));
        }

        if (!string.IsNullOrWhiteSpace(filter?.Status) &&
            Enum.TryParse<ReservationStatus>(filter.Status, true, out var status))
        {
            sql += " AND Status = @Status";
            parameters.Add("Status", (int)status);
        }

        sql += " ORDER BY ReservationDate DESC, ReservationTime DESC";

        using var connection = _connectionFactory.CreateConnection();
        var rows = await connection.QueryAsync<ReservationRow>(sql, parameters);
        return rows.Select(Map).ToList();
    }

    public async Task<Reservation?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        const string sql = """
            SELECT Id, CustomerName, Email, Phone, ReservationDate, ReservationTime,
                   GuestCount, SpecialRequest, Status, CreatedAt, UpdatedAt
            FROM Reservations WHERE Id = @Id
            """;

        using var connection = _connectionFactory.CreateConnection();
        var row = await connection.QuerySingleOrDefaultAsync<ReservationRow>(sql, new { Id = id });
        return row is null ? null : Map(row);
    }

    public async Task<int> CreateAsync(Reservation reservation, CancellationToken ct = default)
    {
        const string sql = """
            INSERT INTO Reservations
                (CustomerName, Email, Phone, ReservationDate, ReservationTime, GuestCount,
                 SpecialRequest, Status, CreatedAt, UpdatedAt)
            VALUES
                (@CustomerName, @Email, @Phone, @ReservationDate, @ReservationTime, @GuestCount,
                 @SpecialRequest, @Status, @CreatedAt, @UpdatedAt);
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """;

        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(sql, new
        {
            reservation.CustomerName,
            reservation.Email,
            reservation.Phone,
            ReservationDate = reservation.ReservationDate.ToDateTime(TimeOnly.MinValue),
            ReservationTime = reservation.ReservationTime.ToTimeSpan(),
            reservation.GuestCount,
            reservation.SpecialRequest,
            Status = (int)reservation.Status,
            reservation.CreatedAt,
            reservation.UpdatedAt
        });
    }

    public async Task<bool> UpdateStatusAsync(int id, ReservationStatus status, CancellationToken ct = default)
    {
        const string sql = """
            UPDATE Reservations SET Status = @Status, UpdatedAt = @UpdatedAt WHERE Id = @Id
            """;

        using var connection = _connectionFactory.CreateConnection();
        var affected = await connection.ExecuteAsync(sql, new
        {
            Id = id,
            Status = (int)status,
            UpdatedAt = DateTime.UtcNow
        });
        return affected > 0;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        const string sql = "DELETE FROM Reservations WHERE Id = @Id";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync(sql, new { Id = id }) > 0;
    }

    private static Reservation Map(ReservationRow row) => new()
    {
        Id = row.Id,
        CustomerName = row.CustomerName,
        Email = row.Email,
        Phone = row.Phone,
        ReservationDate = DateOnly.FromDateTime(row.ReservationDate),
        ReservationTime = TimeOnly.FromTimeSpan(row.ReservationTime),
        GuestCount = row.GuestCount,
        SpecialRequest = row.SpecialRequest,
        Status = (ReservationStatus)row.Status,
        CreatedAt = row.CreatedAt,
        UpdatedAt = row.UpdatedAt
    };

    private sealed class ReservationRow
    {
        public int Id { get; init; }
        public string CustomerName { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public string Phone { get; init; } = string.Empty;
        public DateTime ReservationDate { get; init; }
        public TimeSpan ReservationTime { get; init; }
        public int GuestCount { get; init; }
        public string? SpecialRequest { get; init; }
        public int Status { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime UpdatedAt { get; init; }
    }
}
