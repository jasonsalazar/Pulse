using MediatR;

namespace SocialApp.Application.Posts.Commands.DeletePost;

public record DeletePostCommand(
    Guid PostId,
    Guid UserId
) : IRequest<Unit>;