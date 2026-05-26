using Fulda.Application.Common;
using Fulda.Application.DTOs.Wine;
using Fulda.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fulda.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WinesController : ControllerBase
{
    private readonly WineService _service;

    public WinesController(WineService service) => _service = service;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<WineCategoryDto>>>> GetPublic(CancellationToken ct)
    {
        var data = await _service.GetPublicWinesAsync(ct);
        return Ok(ApiResponse<IReadOnlyList<WineCategoryDto>>.Ok(data));
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<WineCategoryDto>>>> GetAdmin(CancellationToken ct)
    {
        var data = await _service.GetAdminWinesAsync(ct);
        return Ok(ApiResponse<IReadOnlyList<WineCategoryDto>>.Ok(data));
    }

    [HttpPost("categories")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<int>>> CreateCategory(
        [FromBody] CreateWineCategoryRequest request,
        CancellationToken ct)
    {
        var id = await _service.CreateCategoryAsync(request, ct);
        return Ok(ApiResponse<int>.Ok(id, "Wine category created."));
    }

    [HttpPut("categories/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> UpdateCategory(
        int id,
        [FromBody] UpdateWineCategoryRequest request,
        CancellationToken ct)
    {
        if (!await _service.UpdateCategoryAsync(id, request, ct))
            return NotFound(ApiResponse.Fail("Wine category not found."));
        return Ok(ApiResponse.Ok("Wine category updated."));
    }

    [HttpDelete("categories/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> DeleteCategory(int id, CancellationToken ct)
    {
        if (!await _service.DeleteCategoryAsync(id, ct))
            return NotFound(ApiResponse.Fail("Wine category not found."));
        return Ok(ApiResponse.Ok("Wine category deleted."));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<int>>> CreateWine(
        [FromBody] CreateWineRequest request,
        CancellationToken ct)
    {
        var id = await _service.CreateWineAsync(request, ct);
        return Ok(ApiResponse<int>.Ok(id, "Wine created."));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> UpdateWine(
        int id,
        [FromBody] UpdateWineRequest request,
        CancellationToken ct)
    {
        if (!await _service.UpdateWineAsync(id, request, ct))
            return NotFound(ApiResponse.Fail("Wine not found."));
        return Ok(ApiResponse.Ok("Wine updated."));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> DeleteWine(int id, CancellationToken ct)
    {
        if (!await _service.DeleteWineAsync(id, ct))
            return NotFound(ApiResponse.Fail("Wine not found."));
        return Ok(ApiResponse.Ok("Wine deleted."));
    }
}
