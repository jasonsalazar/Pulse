using MediatR;
using SocialApp.Application.Comments.DTOs;
using SocialApp.Application.Common;

namespace SocialApp.Application.Comments.Queries.GetPostComments;

public class GetPostCommentsQueryHandler(
    IPostRepository postRepository,
    IUserRepository userRepository,
    ICommentRepository commentRepository)
        : IRequestHandler<
        GetPostCommentsQuery,
        IReadOnlyList<CommentResponse>>
{
    private readonly IPostRepository _postRepository = postRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly ICommentRepository _commentRepository = commentRepository;

    public async Task<IReadOnlyList<CommentResponse>> Handle(
        GetPostCommentsQuery request,
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

        var comments = await _commentRepository.GetByPostIdAsync(
            request.PostId,
            cancellationToken);

        var responses = new List<CommentResponse>();

        foreach (var comment in comments)
        {
            var user =
                await _userRepository.GetByIdAsync(
                    comment.UserId,
                    cancellationToken);

            if (user is null)
            {
                continue;
            }

            responses.Add(
                new CommentResponse(
                    comment.Id,
                    comment.PostId,
                    user.Id,
                    user.Username,
                    user.DisplayName,
                    user.ProfileImageUrl,
                    comment.Content,
                    comment.CreatedAt,
                    comment.UpdatedAt
                )
            );
        }

        return responses;
    }
}