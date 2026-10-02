using Microsoft.EntityFrameworkCore;
using SocialApp.Application.Common;
using SocialApp.Domain.Notifications;

namespace SocialApp.Infrastructure.Persistence.Repositories;

public class NotificationRepository(AppDbContext dbContext)
    : INotificationRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task AddAsync(
        Notification notification,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Notifications.AddAsync(
            notification,
            cancellationToken);
    }

    public async Task<Notification?> GetByIdAsync(
        Guid notificationId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Notifications
            .FirstOrDefaultAsync(
                notification => notification.Id == notificationId,
                cancellationToken);
    }

    public async Task<(
        IReadOnlyList<Notification> Items,
        int TotalCount)>
        GetForUserAsync(
            Guid userId,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Notifications
            .AsNoTracking()
            .Where(notification => notification.RecipientId == userId);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(notification => notification.CreatedAt)
            .ThenByDescending(notification => notification.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (
            items,
            totalCount);
    }

    public async Task<int> GetUnreadCountAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Notifications
            .CountAsync(
                notification =>
                    notification.RecipientId == userId &&
                    notification.ReadAt == null,
                cancellationToken);
    }

    public async Task MarkAllAsReadAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Notifications
            .Where(notification =>
                notification.RecipientId == userId &&
                notification.ReadAt == null)
            .ExecuteUpdateAsync(
                setters =>
                    setters.SetProperty(notification =>
                        notification.ReadAt, DateTime.UtcNow),
                cancellationToken);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}