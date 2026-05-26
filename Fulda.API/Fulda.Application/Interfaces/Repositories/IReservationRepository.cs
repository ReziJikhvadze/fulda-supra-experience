using Fulda.Application.DTOs.Reservations;
using Fulda.Domain.Entities;

namespace Fulda.Application.Interfaces.Repositories;

public interface IReservationRepository
{
    Task<IReadOnlyList<Reservation>> GetAllAsync(ReservationFilter? filter = null, CancellationToken ct = default);
    Task<Reservation?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateAsync(Reservation reservation, CancellationToken ct = default);
    Task<bool> UpdateStatusAsync(int id, Domain.Enums.ReservationStatus status, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
