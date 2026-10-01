using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Queries.GetPost;

public class GetPostQueryHandler(
    IPostRepository postRepository,
    IUserRepository userRepository,
    IPostLikeRepository likeRepository,
    ICommentRepository commentRepository)
        : IRequestHandler<GetPostQuery, PostResponse>
{
    private readonly IPostRepository _postRepository = postRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IPostLikeRepository _likeRepository = likeRepository;
    private readonly ICommentRepository _commentRepository = commentRepository;

    public async Task<PostResponse> Handle(
        GetPostQuery request,
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

        var user = await _userRepository.GetByIdAsync(
            post.UserId,
            cancellationToken);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "Post author was not found.");
        }

        var likeCount = await _likeRepository.CountAsync(
            post.Id,
            cancellationToken);

        var commentCount = await _commentRepository.CountByPostIdAsync(
            post.Id,
            cancellationToken);

        var isLiked = await _likeRepository.ExistsAsync(
            post.Id,
            request.CurrentUserId,
            cancellationToken);

        return new PostResponse(
            post.Id,
            user.Id,
            user.Username,
            user.DisplayName,
            user.ProfileImageUrl,
            post.Content,
            post.CreatedAt,
            post.UpdatedAt,
            likeCount,
            commentCount,
            isLiked
        );
    }
}