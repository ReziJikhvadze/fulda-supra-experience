using FluentValidation;
using Fulda.Application.Common;
using Fulda.Application.DTOs.Auth;
using Fulda.Application.Interfaces.Services;
using Fulda.Application.Validators;
using Microsoft.AspNetCore.Mvc;

namespace Fulda.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly LoginRequestValidator _validator;

    public AuthController(IAuthService authService, LoginRequestValidator validator)
    {
        _authService = authService;
        _validator = validator;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login(
        [FromBody] LoginRequest request,
        CancellationToken ct)
    {
        var validation = await _validator.ValidateAsync(request, ct);
        if (!validation.IsValid)
            return BadRequest(ApiResponse<LoginResponse>.Fail(
                "Validation failed.",
                validation.Errors.Select(e => e.ErrorMessage)));

        var result = await _authService.LoginAsync(request, ct);
        if (result is null)
            return Unauthorized(ApiResponse<LoginResponse>.Fail("Invalid username or password."));

        return Ok(ApiResponse<LoginResponse>.Ok(result, "Login successful."));
    }
}
