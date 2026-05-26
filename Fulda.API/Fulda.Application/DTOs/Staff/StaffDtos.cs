namespace Fulda.Application.DTOs.Staff;

public record StaffMemberDto(
    int Id,
    string FullName,
    string Position,
    string? Bio,
    string? ImageUrl,
    int DisplayOrder,
    bool IsActive);

public record CreateStaffMemberRequest(
    string FullName,
    string Position,
    string? Bio,
    string? ImageUrl,
    int DisplayOrder,
    bool IsActive);

public record UpdateStaffMemberRequest(
    string FullName,
    string Position,
    string? Bio,
    string? ImageUrl,
    int DisplayOrder,
    bool IsActive);
