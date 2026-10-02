using MediatR;
using SocialApp.Application.Common;

namespace SocialApp.Application.Notifications.Commands.MarkNotificationAsRead;

public class MarkNotificationAsReadCommandHandler(
    INotificationRepository repository)
        : IRequestHandler<MarkNotificationAsReadCommand>
{
    private readonly INotificationRepository _repository = repository;

    public async Task Handle(
        MarkNotificationAsReadCommand request,
        CancellationToken cancellationToken)
    {
        var notification = await _repository.GetByIdAsync(
            request.NotificationId,
            cancellationToken);

        if (notification is null)
        {
            throw new InvalidOperationException(
                "Notification not found.");
        }

        if (notification.RecipientId != request.UserId)
        {
            throw new UnauthorizedAccessException();
        }

        notification.MarkAsRead();

        await _repository.SaveChangesAsync(cancellationToken);
    }
}