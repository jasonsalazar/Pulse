using MediatR;

namespace SocialApp.Application.Notifications.Commands.MarkNotificationAsRead;

public record MarkNotificationAsReadCommand(
    Guid NotificationId,
    Guid UserId
) : IRequest;