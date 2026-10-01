using MediatR;
using SocialApp.Application.Common;

namespace SocialApp.Application.Comments.Commands.DeleteComment;

public class DeleteCommentCommandHandler(
    ICommentRepository commentRepository)
        : IRequestHandler<DeleteCommentCommand, Unit>
{
    private readonly ICommentRepository _commentRepository = commentRepository;

    public async Task<Unit> Handle(
        DeleteCommentCommand request,
        CancellationToken cancellationToken)
    {
        var comment = await _commentRepository.GetByIdAsync(
            request.CommentId,
            cancellationToken);

        if (comment is null)
        {
            throw new KeyNotFoundException(
                "Comment was not found.");
        }

        if (comment.UserId != request.UserId)
        {
            throw new UnauthorizedAccessException(
                "You can only delete your own comments.");
        }

        await _commentRepository.DeleteAsync(
            comment,
            cancellationToken);

        await _commentRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}