using MediatR;
using SocialApp.Application.Common;
using SocialApp.Domain.Notifications;

namespace SocialApp.Application.Notifications.Commands.CreateNotification;

public class CreateNotificationCommandHandler(
    INotificationRepository repository)
        : IRequestHandler<CreateNotificationCommand>
{
    private readonly INotificationRepository _repository = repository;

    public async Task Handle(
        CreateNotificationCommand request,
        CancellationToken cancellationToken)
    {
        if (request.RecipientId == request.ActorId)
        {
            return;
        }

        var notification = new Notification(
            request.RecipientId,
            request.ActorId,
            request.Type,
            request.PostId);

        await _repository.AddAsync(notification, cancellationToken);

        await _repository.SaveChangesAsync(cancellationToken);
    }
}