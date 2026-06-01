using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Fulda.API.Hubs;

[Authorize(Roles = "Admin")]
public class ReservationHub : Hub
{
    public const string GroupAdmins = "admins";
    public const string EventReservationCreated = "ReservationCreated";

    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, GroupAdmins);
        await base.OnConnectedAsync();
    }
}
