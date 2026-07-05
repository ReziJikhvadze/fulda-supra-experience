using Fulda.Domain.Entities;

namespace Fulda.Application.Interfaces.Repositories;

public interface ISiteImageRepository
{
    Task<IReadOnlyList<SiteImage>> GetAllAsync(CancellationToken ct = default);
    Task<SiteImage?> GetByKeyAsync(string key, CancellationToken ct = default);
    Task UpsertAsync(string key, string? imageData, CancellationToken ct = default);
}
