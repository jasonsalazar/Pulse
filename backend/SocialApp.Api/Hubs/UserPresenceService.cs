using System.Collections.Concurrent;

namespace SocialApp.Api.Hubs;

public class UserPresenceService : IUserPresenceService
{
    private readonly ConcurrentDictionary<Guid, int> _connections = new();

    private readonly ConcurrentDictionary<Guid, DateTimeOffset> _lastSeen =
        new();

    public Task<bool> UserConnectedAsync(Guid userId)
    {
        var connectionCount =
            _connections.AddOrUpdate(
                userId,
                1,
                (_, count) => count + 1);

        if (connectionCount == 1)
        {
            _lastSeen.TryRemove(
                userId,
                out _);
        }

        return Task.FromResult(
            connectionCount == 1);
    }

    public Task<DateTimeOffset?> UserDisconnectedAsync(
        Guid userId)
    {
        while (true)
        {
            if (!_connections.TryGetValue(
                    userId,
                    out var currentCount))
            {
                return Task.FromResult<DateTimeOffset?>(
                    null);
            }

            if (currentCount <= 1)
            {
                var removed =
                    _connections.TryRemove(
                        userId,
                        out _);

                if (removed)
                {
                    var lastSeen =
                        DateTimeOffset.UtcNow;

                    _lastSeen[userId] =
                        lastSeen;

                    return Task.FromResult<DateTimeOffset?>(
                        lastSeen);
                }

                continue;
            }

            if (_connections.TryUpdate(
                    userId,
                    currentCount - 1,
                    currentCount))
            {
                return Task.FromResult<DateTimeOffset?>(
                    null);
            }
        }
    }

    public bool IsOnline(Guid userId)
    {
        return _connections.ContainsKey(userId);
    }

    public DateTimeOffset? GetLastSeen(
        Guid userId)
    {
        return _lastSeen.TryGetValue(
            userId,
            out var lastSeen)
            ? lastSeen
            : null;
    }

    public IReadOnlyCollection<Guid> GetOnlineUsers()
    {
        return [.. _connections.Keys];
    }
}