using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Notifications.DTOs;

namespace SocialApp.Application.Notifications.Queries.GetNotifications;

public record GetNotificationsQuery(
    Guid UserId,
    int Page = 1,
    int PageSize = 20
) : IRequest<PagedResponse<NotificationResponse>>;