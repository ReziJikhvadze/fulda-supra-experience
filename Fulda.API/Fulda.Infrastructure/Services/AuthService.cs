using Fulda.Application.DTOs.Auth;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Application.Interfaces.Services;
using Fulda.Infrastructure.Auth;

namespace Fulda.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IAdminUserRepository _adminUserRepository;
    private readonly JwtTokenService _jwtTokenService;

    public AuthService(IAdminUserRepository adminUserRepository, JwtTokenService jwtTokenService)
    {
        _adminUserRepository = adminUserRepository;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _adminUserRepository.GetByUsernameAsync(request.Username.Trim(), ct);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        var (token, expiresAt) = _jwtTokenService.GenerateToken(user.Username, user.Role);
        return new LoginResponse(token, user.Username, user.Role, expiresAt);
    }
}
