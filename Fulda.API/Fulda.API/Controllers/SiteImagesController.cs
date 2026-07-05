using Fulda.Application.Common;
using Fulda.Application.DTOs.SiteImages;
using Fulda.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fulda.API.Controllers;

[ApiController]
[Route("api/site-images")]
public class SiteImagesController : ControllerBase
{
    private readonly SiteImageService _service;

    public SiteImagesController(SiteImageService service) => _service = service;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<SiteImagesDto>>> GetPublic(CancellationToken ct)
    {
        var data = await _service.GetPublicAsync(ct);
        return Ok(ApiResponse<SiteImagesDto>.Ok(data));
    }

    [HttpPut("{key}")]
    [Authorize(Roles = "Admin")]
    [RequestSizeLimit(8 * 1024 * 1024)]
    public async Task<ActionResult<ApiResponse>> Update(string key, [FromBody] UpdateSiteImageRequest request, CancellationToken ct)
    {
        try
        {
            if (!await _service.UpdateAsync(key, request, ct))
                return BadRequest(ApiResponse.Fail("Unknown image key. Use intro or story."));
            return Ok(ApiResponse.Ok("Image saved."));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message));
        }
    }
}
