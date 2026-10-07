namespace SocialApp.Api.Hubs;

public interface IUserPresenceService
{
    Task<bool> UserConnectedAsync(Guid userId);

    Task<bool> UserDisconnectedAsync(Guid userId);

    bool IsOnline(Guid userId);

    IReadOnlyCollection<Guid> GetOnlineUsers();
}