using Fulda.Domain.Entities;

namespace Fulda.Application.Interfaces.Repositories;

public interface IStaffRepository
{
    Task<IReadOnlyList<StaffMember>> GetAllAsync(bool activeOnly = false, CancellationToken ct = default);
    Task<StaffMember?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateAsync(StaffMember member, CancellationToken ct = default);
    Task<bool> UpdateAsync(StaffMember member, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    Task ReorderAsync(IEnumerable<(int Id, int DisplayOrder)> items, CancellationToken ct = default);
}
