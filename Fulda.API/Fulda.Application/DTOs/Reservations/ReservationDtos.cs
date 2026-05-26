namespace Fulda.Application.DTOs.Reservations;

public record CreateReservationRequest(
    string CustomerName,
    string Email,
    string Phone,
    DateOnly ReservationDate,
    TimeOnly ReservationTime,
    int GuestCount,
    string? SpecialRequest);

public record UpdateReservationStatusRequest(string Status);

public record ReservationDto(
    int Id,
    string CustomerName,
    string Email,
    string Phone,
    DateOnly ReservationDate,
    TimeOnly ReservationTime,
    int GuestCount,
    string? SpecialRequest,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record ReservationFilter(
    string? Search = null,
    DateOnly? Date = null,
    string? Status = null);
