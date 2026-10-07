namespace SocialApp.Api.Hubs;

public interface IUserPresenceService
{
    Task<bool> UserConnectedAsync(Guid userId);

    Task<DateTimeOffset?> UserDisconnectedAsync(Guid userId);

    bool IsOnline(Guid userId);

    DateTimeOffset? GetLastSeen(Guid userId);

    IReadOnlyCollection<Guid> GetOnlineUsers();
}