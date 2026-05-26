using Fulda.Application.Common;
using Fulda.Application.DTOs.Menu;
using Fulda.Application.DTOs.Staff;
using Fulda.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fulda.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StaffController : ControllerBase
{
    private readonly StaffService _service;

    public StaffController(StaffService service) => _service = service;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<StaffMemberDto>>>> GetPublic(CancellationToken ct)
    {
        var data = await _service.GetPublicStaffAsync(ct);
        return Ok(ApiResponse<IReadOnlyList<StaffMemberDto>>.Ok(data));
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<StaffMemberDto>>>> GetAdmin(CancellationToken ct)
    {
        var data = await _service.GetAllAsync(ct);
        return Ok(ApiResponse<IReadOnlyList<StaffMemberDto>>.Ok(data));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<int>>> Create(
        [FromBody] CreateStaffMemberRequest request,
        CancellationToken ct)
    {
        var id = await _service.CreateAsync(request, ct);
        return Ok(ApiResponse<int>.Ok(id, "Staff member created."));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> Update(
        int id,
        [FromBody] UpdateStaffMemberRequest request,
        CancellationToken ct)
    {
        if (!await _service.UpdateAsync(id, request, ct))
            return NotFound(ApiResponse.Fail("Staff member not found."));
        return Ok(ApiResponse.Ok("Staff member updated."));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> Delete(int id, CancellationToken ct)
    {
        if (!await _service.DeleteAsync(id, ct))
            return NotFound(ApiResponse.Fail("Staff member not found."));
        return Ok(ApiResponse.Ok("Staff member deleted."));
    }

    [HttpPut("reorder")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> Reorder(
        [FromBody] ReorderRequest request,
        CancellationToken ct)
    {
        await _service.ReorderAsync(request, ct);
        return Ok(ApiResponse.Ok("Staff reordered."));
    }
}
