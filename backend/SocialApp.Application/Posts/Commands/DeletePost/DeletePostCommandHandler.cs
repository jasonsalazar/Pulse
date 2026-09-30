using MediatR;
using SocialApp.Application.Common;

namespace SocialApp.Application.Posts.Commands.DeletePost;

public class DeletePostCommandHandler(
    IPostRepository postRepository)
        : IRequestHandler<DeletePostCommand, Unit>
{
    private readonly IPostRepository _postRepository = postRepository;

    public async Task<Unit> Handle(
        DeletePostCommand request,
        CancellationToken cancellationToken)
    {
        var post = await _postRepository.GetByIdAsync(
            request.PostId,
            cancellationToken);

        if (post is null)
        {
            throw new KeyNotFoundException(
                "Post was not found.");
        }

        if (post.UserId != request.UserId)
        {
            throw new UnauthorizedAccessException(
                "You can only delete your own posts.");
        }

        await _postRepository.DeleteAsync(post, cancellationToken);

        await _postRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}