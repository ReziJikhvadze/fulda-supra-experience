using Fulda.Application.Common;
using Fulda.Application.DTOs.Menu;
using Fulda.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fulda.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly MenuService _service;

    public MenuController(MenuService service) => _service = service;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<MenuCategoryDto>>>> GetPublic(CancellationToken ct)
    {
        var data = await _service.GetPublicMenuAsync(ct);
        return Ok(ApiResponse<IReadOnlyList<MenuCategoryDto>>.Ok(data));
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<MenuCategoryDto>>>> GetAdmin(CancellationToken ct)
    {
        var data = await _service.GetAdminMenuAsync(ct);
        return Ok(ApiResponse<IReadOnlyList<MenuCategoryDto>>.Ok(data));
    }

    [HttpPost("categories")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<int>>> CreateCategory(
        [FromBody] CreateMenuCategoryRequest request,
        CancellationToken ct)
    {
        var id = await _service.CreateCategoryAsync(request, ct);
        return Ok(ApiResponse<int>.Ok(id, "Category created."));
    }

    [HttpPut("categories/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> UpdateCategory(
        int id,
        [FromBody] UpdateMenuCategoryRequest request,
        CancellationToken ct)
    {
        if (!await _service.UpdateCategoryAsync(id, request, ct))
            return NotFound(ApiResponse.Fail("Category not found."));
        return Ok(ApiResponse.Ok("Category updated."));
    }

    [HttpDelete("categories/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> DeleteCategory(int id, CancellationToken ct)
    {
        if (!await _service.DeleteCategoryAsync(id, ct))
            return NotFound(ApiResponse.Fail("Category not found."));
        return Ok(ApiResponse.Ok("Category deleted."));
    }

    [HttpPut("categories/reorder")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> ReorderCategories(
        [FromBody] ReorderRequest request,
        CancellationToken ct)
    {
        await _service.ReorderCategoriesAsync(request, ct);
        return Ok(ApiResponse.Ok("Categories reordered."));
    }

    [HttpPost("items")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<int>>> CreateItem(
        [FromBody] CreateMenuItemRequest request,
        CancellationToken ct)
    {
        var id = await _service.CreateItemAsync(request, ct);
        return Ok(ApiResponse<int>.Ok(id, "Menu item created."));
    }

    [HttpPut("items/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> UpdateItem(
        int id,
        [FromBody] UpdateMenuItemRequest request,
        CancellationToken ct)
    {
        if (!await _service.UpdateItemAsync(id, request, ct))
            return NotFound(ApiResponse.Fail("Menu item not found."));
        return Ok(ApiResponse.Ok("Menu item updated."));
    }

    [HttpDelete("items/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> DeleteItem(int id, CancellationToken ct)
    {
        if (!await _service.DeleteItemAsync(id, ct))
            return NotFound(ApiResponse.Fail("Menu item not found."));
        return Ok(ApiResponse.Ok("Menu item deleted."));
    }

    [HttpPut("items/reorder")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> ReorderItems(
        [FromBody] ReorderRequest request,
        CancellationToken ct)
    {
        await _service.ReorderItemsAsync(request, ct);
        return Ok(ApiResponse.Ok("Menu items reordered."));
    }
}
