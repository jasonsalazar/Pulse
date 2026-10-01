using MediatR;

namespace SocialApp.Application.Comments.Commands.DeleteComment;

public record DeleteCommentCommand(
    Guid CommentId,
    Guid UserId
) : IRequest<Unit>;