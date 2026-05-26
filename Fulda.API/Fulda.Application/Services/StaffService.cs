using Fulda.Application.DTOs.Menu;
using Fulda.Application.DTOs.Staff;
using Fulda.Application.Interfaces.Repositories;
using Fulda.Domain.Entities;

namespace Fulda.Application.Services;

public class StaffService
{
    private readonly IStaffRepository _repository;

    public StaffService(IStaffRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<StaffMemberDto>> GetPublicStaffAsync(CancellationToken ct = default)
    {
        var members = await _repository.GetAllAsync(activeOnly: true, ct);
        return members.Select(Map).ToList();
    }

    public async Task<IReadOnlyList<StaffMemberDto>> GetAllAsync(CancellationToken ct = default)
    {
        var members = await _repository.GetAllAsync(activeOnly: false, ct);
        return members.Select(Map).ToList();
    }

    public async Task<StaffMemberDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var member = await _repository.GetByIdAsync(id, ct);
        return member is null ? null : Map(member);
    }

    public async Task<int> CreateAsync(CreateStaffMemberRequest request, CancellationToken ct = default)
    {
        var entity = new StaffMember
        {
            FullName = request.FullName.Trim(),
            Position = request.Position.Trim(),
            Bio = request.Bio?.Trim(),
            ImageUrl = request.ImageUrl,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive
        };
        return await _repository.CreateAsync(entity, ct);
    }

    public async Task<bool> UpdateAsync(int id, UpdateStaffMemberRequest request, CancellationToken ct = default)
    {
        var existing = await _repository.GetByIdAsync(id, ct);
        if (existing is null) return false;

        existing.FullName = request.FullName.Trim();
        existing.Position = request.Position.Trim();
        existing.Bio = request.Bio?.Trim();
        existing.ImageUrl = request.ImageUrl;
        existing.DisplayOrder = request.DisplayOrder;
        existing.IsActive = request.IsActive;
        return await _repository.UpdateAsync(existing, ct);
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default) =>
        _repository.DeleteAsync(id, ct);

    public Task ReorderAsync(ReorderRequest request, CancellationToken ct = default) =>
        _repository.ReorderAsync(request.Items.Select(i => (i.Id, i.DisplayOrder)), ct);

    private static StaffMemberDto Map(StaffMember m) => new(
        m.Id, m.FullName, m.Position, m.Bio, m.ImageUrl, m.DisplayOrder, m.IsActive);
}
