using FluentValidation;
using Fulda.Application.Common;
using Fulda.Application.DTOs.Reservations;
using Fulda.Application.Services;
using Fulda.Application.Validators;
using Microsoft.AspNetCore.Mvc;

namespace Fulda.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private readonly ReservationService _service;
    private readonly CreateReservationValidator _createValidator;
    private readonly UpdateReservationStatusValidator _statusValidator;

    public ReservationsController(
        ReservationService service,
        CreateReservationValidator createValidator,
        UpdateReservationStatusValidator statusValidator)
    {
        _service = service;
        _createValidator = createValidator;
        _statusValidator = statusValidator;
    }

    [HttpGet]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ReservationDto>>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] DateOnly? date,
        [FromQuery] string? status,
        CancellationToken ct)
    {
        var filter = new ReservationFilter(search, date, status);
        var data = await _service.GetAllAsync(filter, ct);
        return Ok(ApiResponse<IReadOnlyList<ReservationDto>>.Ok(data));
    }

    [HttpGet("{id:int}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<ReservationDto>>> GetById(int id, CancellationToken ct)
    {
        var data = await _service.GetByIdAsync(id, ct);
        if (data is null)
            return NotFound(ApiResponse<ReservationDto>.Fail("Reservation not found."));
        return Ok(ApiResponse<ReservationDto>.Ok(data));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ReservationDto>>> Create(
        [FromBody] CreateReservationRequest request,
        CancellationToken ct)
    {
        var validation = await _createValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
            return BadRequest(ApiResponse<ReservationDto>.Fail(
                "Validation failed.",
                validation.Errors.Select(e => e.ErrorMessage)));

        var created = await _service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id },
            ApiResponse<ReservationDto>.Ok(created, "Your reservation request has been received."));
    }

    [HttpPut("{id:int}/status")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> UpdateStatus(
        int id,
        [FromBody] UpdateReservationStatusRequest request,
        CancellationToken ct)
    {
        var validation = await _statusValidator.ValidateAsync(request, ct);
        if (!validation.IsValid)
            return BadRequest(ApiResponse.Fail("Validation failed.", validation.Errors.Select(e => e.ErrorMessage)));

        var updated = await _service.UpdateStatusAsync(id, request.Status, ct);
        if (!updated)
            return NotFound(ApiResponse.Fail("Reservation not found."));

        return Ok(ApiResponse.Ok("Reservation status updated."));
    }

    [HttpDelete("{id:int}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> Delete(int id, CancellationToken ct)
    {
        var deleted = await _service.DeleteAsync(id, ct);
        if (!deleted)
            return NotFound(ApiResponse.Fail("Reservation not found."));
        return Ok(ApiResponse.Ok("Reservation deleted."));
    }
}
