using MediatR;

namespace SocialApp.Application.Notifications.Commands.MarkAllNotificationsAsRead;

public record MarkAllNotificationsAsReadCommand(
    Guid UserId
) : IRequest;