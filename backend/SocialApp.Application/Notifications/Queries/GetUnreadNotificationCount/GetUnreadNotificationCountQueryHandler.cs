using MediatR;
using SocialApp.Application.Common;

namespace SocialApp.Application.Notifications.Queries.GetUnreadNotificationCount;

public class GetUnreadNotificationCountQueryHandler(
    INotificationRepository repository)
    : IRequestHandler<GetUnreadNotificationCountQuery, int>
{
    private readonly INotificationRepository _repository = repository;

    public async Task<int> Handle(
        GetUnreadNotificationCountQuery request,
        CancellationToken cancellationToken)
    {
        return await _repository.GetUnreadCountAsync(
            request.UserId,
            cancellationToken);
    }
}