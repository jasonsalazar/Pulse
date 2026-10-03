using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace SocialApp.Api.Hubs;

public class UserIdProvider : IUserIdProvider
{
    public string? GetUserId(
        HubConnectionContext connection)
    {
        return connection.User?
            .FindFirstValue(
                ClaimTypes.NameIdentifier);
    }
}