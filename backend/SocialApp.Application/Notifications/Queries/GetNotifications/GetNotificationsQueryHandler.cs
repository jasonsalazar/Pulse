using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Notifications.DTOs;
using SocialApp.Domain.Users;

namespace SocialApp.Application.Notifications.Queries.GetNotifications;

public class GetNotificationsQueryHandler(
    INotificationRepository notificationRepository,
    IUserRepository userRepository)
    : IRequestHandler<
        GetNotificationsQuery,
        PagedResponse<NotificationResponse>>
{
    private readonly INotificationRepository
        _notificationRepository = notificationRepository;

    private readonly IUserRepository
        _userRepository = userRepository;

    public async Task<PagedResponse<NotificationResponse>> Handle(
        GetNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        var page = request.Page < 1
            ? 1
            : request.Page;

        var pageSize = request.PageSize switch
        {
            < 1 => 20,
            > 50 => 50,
            _ => request.PageSize
        };

        var (Items, TotalCount) =
            await _notificationRepository.GetForUserAsync(
                request.UserId,
                page,
                pageSize,
                cancellationToken);

        var actorIds = Items
            .Select(notification =>
                notification.ActorId)
            .Distinct()
            .ToList();

        var actors = await _userRepository.GetByIdsAsync(
            actorIds,
            cancellationToken);

        var actorLookup = actors.ToDictionary(actor => actor.Id);

        var notifications = Items
            .Where(notification =>
                actorLookup.ContainsKey(notification.ActorId))
            .Select(notification =>
            {
                var actor = actorLookup[notification.ActorId];

                return new NotificationResponse(
                    notification.Id,
                    actor.Id,
                    actor.Username,
                    actor.DisplayName,
                    actor.ProfileImageUrl,
                    notification.Type.ToString(),
                    notification.PostId,
                    notification.CreatedAt,
                    notification.ReadAt is not null);
            })
            .ToList();

        return new PagedResponse<NotificationResponse>(
            notifications,
            page,
            pageSize,
            TotalCount
        );
    }
}