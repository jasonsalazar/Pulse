using MediatR;
using SocialApp.Application.Common;

namespace SocialApp.Application.Notifications.Commands.MarkAllNotificationsAsRead;

public class MarkAllNotificationsAsReadCommandHandler(
    INotificationRepository repository)
        : IRequestHandler<MarkAllNotificationsAsReadCommand>
{
    private readonly INotificationRepository _repository = repository;

    public async Task Handle(
        MarkAllNotificationsAsReadCommand request,
        CancellationToken cancellationToken)
    {
        await _repository.MarkAllAsReadAsync(
            request.UserId,
            cancellationToken);
    }
}