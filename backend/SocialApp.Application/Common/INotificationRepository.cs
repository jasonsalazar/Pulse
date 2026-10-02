using SocialApp.Domain.Notifications;

namespace SocialApp.Application.Common;

public interface INotificationRepository
{
    Task AddAsync(
        Notification notification,
        CancellationToken cancellationToken = default);

    Task<Notification?> GetByIdAsync(
        Guid notificationId,
        CancellationToken cancellationToken = default);

    Task<(IReadOnlyList<Notification> Items, int TotalCount)>
        GetForUserAsync(
            Guid userId,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default);

    Task<int> GetUnreadCountAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task MarkAllAsReadAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}