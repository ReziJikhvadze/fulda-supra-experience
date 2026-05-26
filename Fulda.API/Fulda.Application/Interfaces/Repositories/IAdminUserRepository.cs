using Fulda.Domain.Entities;

namespace Fulda.Application.Interfaces.Repositories;

public interface IAdminUserRepository
{
    Task<AdminUser?> GetByUsernameAsync(string username, CancellationToken ct = default);
}
