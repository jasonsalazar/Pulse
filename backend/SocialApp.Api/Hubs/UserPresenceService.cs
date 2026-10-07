using System.Collections.Concurrent;

namespace SocialApp.Api.Hubs;

public class UserPresenceService : IUserPresenceService
{
    private readonly ConcurrentDictionary<Guid, int> _connections = new();

    public Task<bool> UserConnectedAsync(Guid userId)
    {
        var connectionCount =
            _connections.AddOrUpdate(
                userId,
                1,
                (_, count) => count + 1);

        return Task.FromResult(
            connectionCount == 1);
    }

    public Task<bool> UserDisconnectedAsync(Guid userId)
    {
        while (true)
        {
            if (!_connections.TryGetValue(
                    userId,
                    out var currentCount))
            {
                return Task.FromResult(false);
            }

            if (currentCount <= 1)
            {
                var removed =
                    _connections.TryRemove(
                        userId,
                        out _);

                if (removed)
                {
                    return Task.FromResult(true);
                }

                continue;
            }

            if (_connections.TryUpdate(
                    userId,
                    currentCount - 1,
                    currentCount))
            {
                return Task.FromResult(false);
            }
        }
    }

    public bool IsOnline(Guid userId)
    {
        return _connections.ContainsKey(userId);
    }

    public IReadOnlyCollection<Guid> GetOnlineUsers()
    {
        return [.. _connections.Keys];
    }
}