using Fulda.Application.DTOs.Reservations;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Domain.Entities;
using Fulda.Domain.Enums;

namespace Fulda.Application.Services;

public class ReservationService
{
    private readonly IReservationRepository _repository;

    public ReservationService(IReservationRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<ReservationDto>> GetAllAsync(ReservationFilter? filter = null, CancellationToken ct = default)
    {
        var rows = await _repository.GetAllAsync(filter, ct);
        return rows.Select(Map).ToList();
    }

    public async Task<ReservationDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var entity = await _repository.GetByIdAsync(id, ct);
        return entity is null ? null : Map(entity);
    }

    public async Task<ReservationDto> CreateAsync(CreateReservationRequest request, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var entity = new Reservation
        {
            CustomerName = request.CustomerName.Trim(),
            Email = request.Email.Trim(),
            Phone = request.Phone.Trim(),
            ReservationDate = request.ReservationDate,
            ReservationTime = request.ReservationTime,
            GuestCount = request.GuestCount,
            SpecialRequest = string.IsNullOrWhiteSpace(request.SpecialRequest) ? null : request.SpecialRequest.Trim(),
            Status = ReservationStatus.Pending,
            CreatedAt = now,
            UpdatedAt = now
        };

        var id = await _repository.CreateAsync(entity, ct);
        entity.Id = id;
        return Map(entity);
    }

    public async Task<bool> UpdateStatusAsync(int id, string status, CancellationToken ct = default)
    {
        if (!Enum.TryParse<ReservationStatus>(status, true, out var parsed))
            return false;

        return await _repository.UpdateStatusAsync(id, parsed, ct);
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default) =>
        _repository.DeleteAsync(id, ct);

    private static ReservationDto Map(Reservation r) => new(
        r.Id,
        r.CustomerName,
        r.Email,
        r.Phone,
        r.ReservationDate,
        r.ReservationTime,
        r.GuestCount,
        r.SpecialRequest,
        r.Status.ToString(),
        r.CreatedAt,
        r.UpdatedAt);
}
