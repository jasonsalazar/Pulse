using MediatR;
using SocialApp.Domain.Notifications;

namespace SocialApp.Application.Notifications.Commands.CreateNotification;

public record CreateNotificationCommand(
    Guid RecipientId,
    Guid ActorId,
    NotificationType Type,
    Guid? PostId = null
) : IRequest;