using MediatR;

namespace SocialApp.Application.Notifications.Queries.GetUnreadNotificationCount;

public record GetUnreadNotificationCountQuery(
    Guid UserId
) : IRequest<int>;